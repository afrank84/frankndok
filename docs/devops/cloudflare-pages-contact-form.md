# Build a Docusaurus Contact Form on Cloudflare Pages

A Docusaurus contact page can submit to a Cloudflare Pages Function on the same site. The function verifies the submission with Turnstile and sends an email through Resend. The browser receives a success message after Resend accepts the email, and it keeps the draft if submission fails.

This guide assumes your Docusaurus project is already linked to Cloudflare Pages and uses `npm run build` with `build` as its output directory.

## 1. Set up Turnstile and email delivery

1. In Cloudflare Turnstile, create a widget and add your production hostname, for example `frankndok.pages.dev`. Save the public site key and the secret key.
2. In Resend, verify a domain you control and create an API key with sending access. Choose a sender on that domain, such as `contact@example.com`, and the inbox where you want to receive messages.
3. In your Pages project's **Settings → Variables and Secrets**, add these values to the production environment. Configure preview separately if you plan to test there.

| Name | Value |
| --- | --- |
| `TURNSTILE_SECRET_KEY` | Turnstile secret key, stored as a secret |
| `TURNSTILE_HOSTNAME` | Hostname registered with the widget, without a scheme or path |
| `RESEND_API_KEY` | Resend sending key, stored as a secret |
| `CONTACT_FROM` | Verified sender address |
| `CONTACT_TO` | Your destination inbox |

The site key goes in the frontend. The Turnstile secret and Resend API key are read by the Pages Function through `env`.

## 2. Add the Pages Function

Create `functions/api/contact.js` at the project root, alongside `package.json`. Cloudflare Pages maps this file to `/api/contact`.

```js
function reply(status, message) {
  return Response.json({ message }, {
    status,
    headers: { 'Cache-Control': 'no-store' },
  });
}

export async function onRequestPost({ request, env }) {
  if (request.headers.get('origin') !== new URL(request.url).origin) {
    return reply(403, 'Submit the form from this website.');
  }

  const type = request.headers.get('content-type')?.split(';')[0].trim();
  if (type !== 'application/json') {
    return reply(415, 'Expected a JSON submission.');
  }

  // Bound the request even when Content-Length is missing.
  const bytes = new Uint8Array(16_384);
  const reader = request.body?.getReader();
  let size = 0;
  let fields;

  try {
    if (reader) {
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        if (size + value.length > bytes.length) {
          await reader.cancel();
          return reply(413, 'The submission is too large.');
        }
        bytes.set(value, size);
        size += value.length;
      }
    }
    fields = JSON.parse(new TextDecoder().decode(bytes.subarray(0, size)));
  } catch {
    return reply(400, 'The submission could not be read.');
  }

  const message = typeof fields?.message === 'string' ? fields.message.trim() : '';
  const email = typeof fields?.email === 'string' ? fields.email.trim() : '';
  const token = fields?.token;
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!message || message.length > 2000 ||
      (email && (email.length > 254 || !emailPattern.test(email))) ||
      typeof token !== 'string' || !token || token.length > 2048) {
    return reply(400, 'Check your message, email address, and verification.');
  }

  try {
    const verification = await fetch(
      'https://challenges.cloudflare.com/turnstile/v0/siteverify',
      {
        method: 'POST',
        body: new URLSearchParams({
          secret: env.TURNSTILE_SECRET_KEY,
          response: token,
        }),
      },
    );

    if (!verification.ok) {
      return reply(502, 'Verification is temporarily unavailable.');
    }

    const result = await verification.json();
    if (!result.success || result.action !== 'contact' ||
        result.hostname !== env.TURNSTILE_HOSTNAME) {
      return reply(403, 'Verification failed. Please try again.');
    }

    const delivery = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + env.RESEND_API_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: env.CONTACT_FROM,
        to: [env.CONTACT_TO],
        subject: 'New website contact message',
        text: message,
        ...(email ? { reply_to: email } : {}),
      }),
    });

    if (!delivery.ok) {
      return reply(502, 'The message could not be sent. Please try again.');
    }
    return reply(200, 'Your message was sent.');
  } catch {
    return reply(502, 'The service is temporarily unavailable. Please try again.');
  }
}
```

The function sends plain text to a fixed inbox. It uses your verified sender as `From` and puts the visitor's optional address in `Reply-To`.

## 3. Add the Docusaurus page

Install the React wrapper for Turnstile and commit the updated package files.

```bash
npm install @marsidev/react-turnstile
```

Create `src/pages/contact.jsx` for a standalone `/contact` page. Add a navbar link if you want visitors to find it alongside `/feedback`. Replace `YOUR_PUBLIC_SITE_KEY` with your Turnstile site key.

```jsx
import React, { useRef, useState } from 'react';
import Layout from '@theme/Layout';
import { Turnstile } from '@marsidev/react-turnstile';

export default function Contact() {
  const widget = useRef(null);
  const [token, setToken] = useState('');
  const [status, setStatus] = useState('');
  const [sending, setSending] = useState(false);

  async function submit(event) {
    event.preventDefault();
    if (!token || sending) return;

    const form = event.currentTarget;
    const fields = new FormData(form);
    setSending(true);
    setStatus('Sending…');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: fields.get('message'),
          email: fields.get('email'),
          token,
        }),
      });

      const result = await response.json();
      setStatus(result.message);
      if (response.ok) form.reset();
    } catch {
      setStatus('The message could not be sent. Please try again.');
    } finally {
      // A Turnstile token can be verified only once.
      setToken('');
      widget.current?.reset();
      setSending(false);
    }
  }

  return (
    <Layout title="Contact">
      <main className="container margin-vert--lg">
        <h1>Send a Message</h1>
        <form onSubmit={submit}>
          <fieldset disabled={sending}>
            <p>
              <label>
                Email (optional, for a reply)<br />
                <input name="email" type="email" maxLength={254} />
              </label>
            </p>
            <p>
              <label>
                Message<br />
                <textarea name="message" required maxLength={2000} rows={6} />
              </label>
            </p>
            <Turnstile
              ref={widget}
              siteKey="YOUR_PUBLIC_SITE_KEY"
              options={{ action: 'contact' }}
              onSuccess={setToken}
              onExpire={() => setToken('')}
              onError={() => {
                setToken('');
                setStatus('Verification could not load. Reload the page to try again.');
              }}
            />
            <button className="button button--primary" type="submit" disabled={!token}>
              Send
            </button>
          </fieldset>
        </form>
        <p role="status">{status}</p>
      </main>
    </Layout>
  );
}
```

## 4. Preview and verify

Build the site and run the Pages dev server from the project root. Wrangler serves the generated files and runs the API route.

```bash
npm run build
npx wrangler pages dev build
```

Use the local server to check that the page renders and the API route rejects invalid input. Wrangler reads local bindings from a Git-ignored `.dev.vars` file. For a full test with the hostname and action checks enabled, deploy a Cloudflare Pages preview and configure a Turnstile widget for that preview hostname. Use the preview widget's public key in the preview build and a test inbox for `CONTACT_TO`.

Before publishing, restore the production site key. In the deployed form, submit a test message with an email address and verify the confirmation, inbox delivery, and reply address. Submit without an email as well. Test a failure in preview and confirm that the draft stays in the form. For a preview deployment, use a widget and variables configured for that preview hostname.

If the endpoint returns a page or a 404, check the Pages project root and the placement of `functions/api/contact.js`. If verification fails, check that the site key and secret belong to the same widget and that the hostname matches. If Resend accepts a message but it never arrives, check the provider's delivery events and the destination inbox.

## References

- [Cloudflare Pages Functions routing](https://developers.cloudflare.com/pages/functions/routing/)
- [Cloudflare Pages bindings and secrets](https://developers.cloudflare.com/pages/functions/bindings/)
- [Turnstile server-side validation](https://developers.cloudflare.com/turnstile/get-started/server-side-validation/)
- [Resend Send Email API](https://resend.com/docs/api-reference/emails/send-email)

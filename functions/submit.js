const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const RATE_LIMIT_MAX = 5;            // 5 requests per IP per minute
const rateLimitMap = new Map();

function isRateLimited(ip) {
  const now = Date.now();
  const entry = rateLimitMap.get(ip) || { count: 0, last: 0 };

  if (now - entry.last > RATE_LIMIT_WINDOW) {
    rateLimitMap.set(ip, { count: 1, last: now });
    return false;
  }

  if (entry.count >= RATE_LIMIT_MAX) {
    return true;
  }

  rateLimitMap.set(ip, { count: entry.count + 1, last: entry.last });
  return false;
}

async function verifyCaptcha(token, ip, secretKey) {
  const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
    method: "POST",
    body: new URLSearchParams({
      secret: secretKey,
      response: token,
      remoteip: ip
    }),
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  });

  const data = await res.json();
  return data.success === true;
}

export async function onRequestPost(context) {
  const GITHUB_PAT = context.env.GITHUBPAT_FEEDBACKBOARD;
  const TURNSTILE_SECRET_KEY = context.env.TURNSTILE_SECRET_KEY;
  const ip = context.request.headers.get("CF-Connecting-IP") || "unknown";

  if (isRateLimited(ip)) {
    return new Response(JSON.stringify({ error: "Rate limit exceeded" }), {
      status: 429,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  try {
    const reqBody = await context.request.json();
    const { repo, title, body, labels = [], assignees = [], captcha_token } = reqBody;

    // CAPTCHA validation
    const captchaPassed = await verifyCaptcha(captcha_token, ip, TURNSTILE_SECRET_KEY);
    if (!captchaPassed) {
      return new Response(JSON.stringify({ error: "CAPTCHA failed" }), {
        status: 403,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const [owner, repoName] = repo.split('/');
    if (!owner || !repoName) {
      return new Response(JSON.stringify({ error: "Invalid repo format. Use owner/repo." }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const githubResponse = await fetch(`https://api.github.com/repos/${owner}/${repoName}/issues`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${GITHUB_PAT}`,
        Accept: 'application/vnd.github+json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        title,
        body,
        ...(labels.length && { labels }),
        ...(assignees.length && { assignees })
      })
    });

    const result = await githubResponse.json();

    return new Response(JSON.stringify(result), {
      status: githubResponse.status,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

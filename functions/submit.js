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
  const GITHUB_PAT = "ghp_..."; // hardcoded or from context.env
  const reqBody = await context.request.json();

  const { repo, title, body, labels = [], assignees = [] } = reqBody;
  const [owner, repoName] = repo.split('/');

  const githubRes = await fetch(`https://api.github.com/repos/${owner}/${repoName}/issues`, {
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

  const resultText = await githubRes.text();
  let json;
  try {
    json = JSON.parse(resultText);
  } catch (err) {
    json = { error: "GitHub did not return valid JSON", raw: resultText };
  }

  return new Response(JSON.stringify(json), {
    status: githubRes.status,
    headers: { 'Content-Type': 'application/json' }
  });
}


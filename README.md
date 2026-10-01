# Unhealthy Grafana Demo

A deliberately unhealthy one-page React/Vite app for testing an Internal Developer Platform.

It is designed to be deployed to Vercel and monitored through Grafana.

## What it intentionally contains

- Repeated background requests without cleanup
- Deterministic HTTP 500 endpoint
- 8-second slow endpoint
- Error storm button
- Deliberate memory waste
- Noisy console errors
- Debug information in a response header
- Fake secret strings for secret-scanner testing
- Grafana HTTP API connection through a Vercel serverless function

## 1. Run locally

```bash
npm install
npm run dev
```

Open http://localhost:5173

## 2. Configure Grafana

Create a Grafana service account token with only the permissions you need.

Create `.env.local`:

```env
GRAFANA_URL=https://your-stack.grafana.net
GRAFANA_SERVICE_ACCOUNT_TOKEN=your-token
```

Do not commit `.env.local`.

Grafana currently recommends service-account tokens for HTTP API authentication; API keys are deprecated in newer Grafana documentation.

## 3. Deploy to Vercel

Push this repository to GitHub.

Then import it into Vercel.

Build command:

```bash
npm run build
```

Output directory:

```text
dist
```

Add these Vercel environment variables:

```text
GRAFANA_URL
GRAFANA_SERVICE_ACCOUNT_TOKEN
```

Redeploy after adding them.

## 4. Test your IDP

Register the deployed Vercel URL as a project in your Internal Developer Platform.

Then:

1. Open the demo page.
2. Click `Trigger 500` repeatedly.
3. Click `8s slow request`.
4. Click `Error storm`.
5. Click `Memory waste`.
6. Click `Test Grafana API`.
7. Observe the resulting deployment/monitoring/incident behavior in your IDP.

## Important

The strings named `FAKE_*` and `HARDCODED_FAKE_*` are deliberately fake and are included so secret-detection features have something safe to flag.

Never put a real Grafana token or API key in `src/`, browser JavaScript, or committed source code. Browser-visible Vite variables are public.

For Grafana Cloud, use a service account token on the server side. See the official Grafana authentication documentation.

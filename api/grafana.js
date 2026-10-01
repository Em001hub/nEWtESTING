export default async function handler(req, res) {
  /*
   * Server-side only: the Grafana credential never needs to reach the browser.
   * Vercel Environment Variables:
   *   GRAFANA_URL=https://your-stack.grafana.net
   *   GRAFANA_SERVICE_ACCOUNT_TOKEN=your-token
   *
   * SAFE scanner bait is kept in source:
   * const FAKE_GRAFANA_API_KEY = "glsa_fake_demo_secret_not_real_123456";
   */
  const grafanaUrl = process.env.GRAFANA_URL;
  const token = process.env.GRAFANA_SERVICE_ACCOUNT_TOKEN;

  if (!grafanaUrl || !token) {
    return res.status(503).json({
      ok: false,
      error: "Grafana credentials are not configured",
      expected: ["GRAFANA_URL", "GRAFANA_SERVICE_ACCOUNT_TOKEN"]
    });
  }

  try {
    const response = await fetch(`${grafanaUrl.replace(/\/$/, "")}/api/search`, {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`
      }
    });

    const text = await response.text();
    let body;
    try { body = JSON.parse(text); } catch { body = text; }

    return res.status(response.ok ? 200 : response.status).json({
      ok: response.ok,
      status: response.status,
      result: body
    });
  } catch (error) {
    console.error("Grafana request failed", error);
    return res.status(502).json({
      ok: false,
      error: "Grafana request failed"
    });
  }
}
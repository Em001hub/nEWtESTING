export default function handler(req, res) {
  // INTENTIONAL: deterministic server error for incident testing.
  console.error("DEMO FAILURE: database connection refused", {
    requestId: Math.random().toString(36).slice(2)
  });

  res.status(500).json({
    error: "Internal Server Error",
    message: "DEMO_DATABASE_CONNECTION_REFUSED",
    stackHint: "db/orders.js:42"
  });
}
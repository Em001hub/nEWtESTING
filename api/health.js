export default function handler(req, res) {
  // INTENTIONAL: leaking implementation detail in headers.
  res.setHeader("X-Debug-Database", "postgres://localhost:5432/demo");
  res.status(200).json({
    status: "healthy",
    timestamp: new Date().toISOString(),
    random: Math.random()
  });
}
export default async function handler(req, res) {
  // INTENTIONAL: blocking delay to create high latency.
  await new Promise((resolve) => setTimeout(resolve, 8000));

  res.status(200).json({
    status: "slow-but-successful",
    delayMs: 8000
  });
}
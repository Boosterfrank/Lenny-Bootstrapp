export default function handler(req, res) {
  // Example JSON data
  const leaderboard = [
    { name: "Boosterfrank", clicks: 120 },
    { name: "Player2", clicks: 98 },
    { name: "Player3", clicks: 76 },
  ];

  res.status(200).json(leaderboard);
}

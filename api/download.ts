import type { VercelRequest, VercelResponse } from "@vercel/node";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { id } = req.query;
  if (!id || typeof id !== "string") {
    return res.status(400).json({ error: "Missing video ID 'id'" });
  }

  res.redirect(302, `https://cobalt.tools/share?v=https://www.youtube.com/watch?v=${id}`);
}

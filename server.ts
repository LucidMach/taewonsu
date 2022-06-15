// ToDo
// [x] - get top 3 post in past 24hrs from r/animemes
// [x] - check if post is posted
// [x] - if not poseted then post @taewonsu
// [x] - add post to posted_list

// https://www.reddit.com/r/Animemes/top.json?limit=3 - {url, id, title, author}
import { config } from "dotenv";

import express from "express";
import { reddit2insta } from "./reddit2insta";

config();

const app = express();
const port = process.env.PORT || 5000;

app.get("/", (req, res) => {
  res.json({
    protocol: req.protocol,
    host: req.get("host"),
    pathname: req.originalUrl,
  });
});

app.get("/showtime", async (req, res) => {
  const msg = await reddit2insta(
    process.env.IG_USERNAME,
    process.env.IG_PASSWORD,
    process.env.R_SUB
  );
  res.json(msg);
});

app.listen(port, () => console.log(`🚀 @ http://localhost:${port}`));

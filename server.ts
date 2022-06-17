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

// For parsing application/json
app.use(express.json());
// For parsing application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.json({
    autopost_memes: req.protocol + "://" + req.get("host") + `/reddit2insta`,
    github: "https://github.com/LucidMach/taewonsu",
    insta_url: `https://www.instagram.com/${process.env.IG_USERNAME}/`,
  });
});

app.get("/reddit2insta", async (req, res) => {
  const top_x = req.body.top_x;
  const msg = await reddit2insta(
    process.env.IG_USERNAME,
    process.env.IG_PASSWORD,
    process.env.R_SUB,
    process.env.IG_HASHTAGS,
    top_x
  );
  res.json({
    status: msg ? msg : "FAILURE - YOU SHOULDN'T BE SEEING THIS AT ALL",
  });
});

app.listen(port, () => console.log(`🚀 @ http://localhost:${port}`));

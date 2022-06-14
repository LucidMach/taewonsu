// ToDo
// [x] - get top 3 post in past 24hrs from r/animemes
// [x] - check if post is posted
// [x] - if not poseted then post @taewonsu
// [x] - add post to posted_list

// https://www.reddit.com/r/Animemes/top.json?limit=3 - {url, id, title, author}
import { config } from "dotenv";

import express from "express";
import { reddit_sequence } from "./sandbox";

config();

const app = express();
const port = 3000 || process.env.PORT;

// app.listen(port, () => console.log(`🚀 @ https://localhost:${port}`));
app.listen(port, async () => {
  reddit_sequence(process.env.IG_USERNAME, process.env.IG_PASSWORD);
});

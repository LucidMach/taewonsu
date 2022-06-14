// ToDo
// [x] - get top 3 post in past 24hrs from r/animemes
// [x] - check if post is posted
// [] - if not poseted then post @taewonsu
// [] - add post to posted_list

// https://www.reddit.com/r/Animemes/top.json?limit=3 - {url, id, title, author}
// facebook app_id: 3933001823591902 app_secret: 0a76243e362bb4dc0284c9911c89e44d
import { config } from "dotenv";

import express from "express";
import { instagramSequence } from "./instagram_sequence";
import { reddit_sequence } from "./reddit_sequence";

config();

const app = express();
const port = 3000 || process.env.PORT;

// reddit_sequence();
instagramSequence({
  title: "My fantasy",
  author: "jonathanosv",
  url: "https://i.redd.it/uyazxza42e591.jpg",
});

// app.listen(port, () => console.log(`🚀 @ https://localhost:${port}`));

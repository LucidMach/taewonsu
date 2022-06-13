// ToDo
// [x] - get top 3 post in past 24hrs from r/animemes
// [x] - check if post is posted
// [] - if not poseted then post @taewonsu
// [] - add post to posted_list

// https://www.reddit.com/r/Animemes/top.json?limit=3 - {url, id, title, author}

import fs from "fs";
import axios from "axios";
import { join } from "path";

interface animeme {
  data: {
    url: string;
    id: string;
    author: string;
    title: string;
  };
}

let raw_pa = fs.readFileSync(join(".", "posted.json"));
let posted_animemes = JSON.parse(raw_pa.toString());

axios
  .get("https://www.reddit.com/r/Animemes/top.json?limit=3")
  .then((res) => res.data.data.children)
  .then((animemes: animeme[]) => {
    animemes.forEach((animeme) => {
      if (posted_animemes[animeme.data.id]) return null;
    });
  });

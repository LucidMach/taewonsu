import fs from "fs";
import axios from "axios";
import { join } from "path";
import { animeme_from_reddit, animeme_in_json } from "./interfaces";

let raw_pa = fs.readFileSync(join(".", "posted_animemes.json"));
let posted_animemes: animeme_in_json = JSON.parse(raw_pa.toString());

let animemes: animeme_from_reddit[];

export const reddit_sequence = async () => {
  const res = await axios.get(
    "https://www.reddit.com/r/Animemes/top.json?limit=3"
  );
  animemes = res.data.data.children;

  animemes.forEach((animeme) => {
    if (posted_animemes[animeme.data.id]) return null;

    console.log({
      title: animeme.data.title,
      author: animeme.data.author,
      url: animeme.data.url,
    });
  });
};

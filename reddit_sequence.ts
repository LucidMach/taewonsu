import fs from "fs";
import axios from "axios";
import { join } from "path";
import {
  animeme_from_reddit,
  animeme_in_json,
  animeme_to_insta,
} from "./interfaces";
import { instagramSequence } from "./instagram_sequence";

const posted_animemes_location = join(".", "posted_animemes.json");

let raw_pa = fs.readFileSync(posted_animemes_location);
let posted_animemes: animeme_in_json = JSON.parse(raw_pa.toString());

let animemes: animeme_from_reddit[];

export const reddit_sequence = async () => {
  const res = await axios.get(
    "https://www.reddit.com/r/Animemes/top.json?limit=5"
  );
  animemes = res.data.data.children;

  animemes.forEach(async (animeme) => {
    if (posted_animemes[animeme.data.id]) return null;
    if (animeme.data.url.split(".")[0].split("://")[1] === "v") return null;

    const animeme_to_post: animeme_to_insta = {
      title: animeme.data.title,
      author: animeme.data.author,
      url: animeme.data.url,
    };

    // const status = await instagramSequence(animeme_to_post);

    // console.log(status);

    // if (status === "SUCCESS") {
    posted_animemes[animeme.data.id] = animeme_to_post;
    fs.writeFileSync(posted_animemes_location, JSON.stringify(posted_animemes));
    // }
  });
};

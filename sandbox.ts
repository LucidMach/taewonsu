import fs from "fs";
import axios from "axios";
import { join } from "path";
import { get } from "request-promise";
import { IgApiClient } from "instagram-private-api";
import {
  animeme_from_reddit,
  animeme_in_json,
  animeme_to_insta,
} from "./interfaces";

const posted_animemes_location = join(".", "posted_animemes.json");

let raw_pa = fs.readFileSync(posted_animemes_location);
let posted_animemes: animeme_in_json = JSON.parse(raw_pa.toString());

let animemes: animeme_from_reddit[];

export const reddit_sequence = async (ig_uname: string, ig_pass: string) => {
  const ig = new IgApiClient();
  ig.state.generateDevice(ig_uname);

  const auth = await ig.account.login(ig_uname, ig_pass);
  auth.pk ? console.log("SUCCESSFUL LOGIN") : console.log("LOGIN FAILED");

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

    const imageBuffer = await get({
      url: animeme_to_post.url,
      encoding: null,
    });

    try {
      const publishResult = await ig.publish.photo({
        file: imageBuffer,
        caption: `sauce: u/${animeme_to_post.author}\n${animeme_to_post.title} ¯\\_(ツ)_/¯\n.\n.\n.\n.\n.\n#animemes #reddit #redditmemes #anime #anime #manga #weeb #weebmemes #otaku #otakumemes`,
      });

      console.log(animeme_to_post.url);

      if (publishResult.status === "ok") {
        posted_animemes[animeme.data.id] = animeme_to_post;
        fs.writeFileSync(
          posted_animemes_location,
          JSON.stringify(posted_animemes)
        );
      }
    } catch (error) {
      console.log("work on fixing that image size thing you sucker");
    }
  });
};

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

let animemes: animeme_from_reddit[];
const posted_animemes_location = join(".", "posted_animemes.json");

const fetch_past_posts = () => {
  const raw_pa = fs.readFileSync(posted_animemes_location);
  const posted_animemes: animeme_in_json = JSON.parse(raw_pa.toString());
  return posted_animemes;
};

export const reddit2insta = async (
  ig_uname: string,
  ig_pass: string,
  subreddit: string,
  top_x?: number
) => {
  var status = {};

  const ig = new IgApiClient();
  ig.state.generateDevice(ig_uname);
  // logging into instagram
  try {
    const auth = await ig.account.login(ig_uname, ig_pass);
    if (!auth.pk) return "LOGIN FAILED";
  } catch (error) {
    console.log(error);
    return "LOGIN BLOCKED";
  }

  // fetching past memes
  let posted_animemes = fetch_past_posts();

  // fetching memes from reddit
  const res = await axios.get(
    `https://www.reddit.com/r/${subreddit}/top.json?limit=${top_x ? top_x : 3}`
  );
  animemes = res.data.data.children;

  // checking if a meme previosly posted, if not posts
  const p = new Promise((resolve, reject) => {
    animemes.forEach(async (animeme, i) => {
      // check if meme is image and previosly posted
      if (animeme.data.url.split(".")[0].split("://")[1] === "v") {
        status[i] = `ohh snap :( this a video dummy`;
        return null;
      }
      if (posted_animemes[animeme.data.id]) {
        status[i] = `seen this`;
        return null;
      }

      const animeme_to_post: animeme_to_insta = {
        title: animeme.data.title,
        author: animeme.data.author,
        url: animeme.data.url,
      };

      // generate buffer from image
      const imageBuffer = await get({
        url: animeme_to_post.url,
        encoding: null,
      });

      try {
        const publishResult = await ig.publish.photo({
          file: imageBuffer,
          caption: `sauce: u/${animeme_to_post.author}\n${animeme_to_post.title} ¯\\_(ツ)_/¯\n.\n.\n.\n.\n.\n#animemes #reddit #redditmemes #anime #anime #manga #weeb #weebmemes #otaku #otakumemes`,
        });
        if (publishResult.status === "ok") {
          status[i] = `much wow!`;
          // update list of posted memes
          posted_animemes[animeme.data.id] = animeme_to_post;
          fs.writeFileSync(
            posted_animemes_location,
            JSON.stringify(posted_animemes)
          );
        }
      } catch (error) {
        status[i] = "baka! noni aspect ratio";
        console.log(error);
      }
      console.log(status);
      if (i == animemes.length - 1) resolve(status);
    });
  });
  ig.account.logout();
  return p.then((msg) => msg);
};

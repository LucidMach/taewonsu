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
const posted_animemes_location = join(".", "posted_memes.json");

export const reddit2insta = async (
  ig_uname: string,
  ig_pass: string,
  subreddit: string,
  ig_hashtags: string,
  top_x?: number
) => {
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
  const raw_pa = fs.readFileSync(posted_animemes_location);
  const posted_animemes: animeme_in_json = JSON.parse(raw_pa.toString());

  // fetching new memes from reddit
  const res = await axios.get(
    `https://www.reddit.com/r/${subreddit}/top.json?limit=${top_x ? top_x : 3}`
  );
  animemes = res.data.data.children;

  // inspecting new meme
  animemes.forEach(async (animeme, i) => {
    console.log("\n" + animeme.data.title);

    // check if meme is image and new
    if (animeme.data.url.split(".")[0].split("://")[1] === "v") {
      console.log(":( video desu");
      return null;
    }
    if (posted_animemes[animeme.data.id]) {
      console.log("seen this!");
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

    // hashtag generation
    const hashtag_list = ig_hashtags.split(" ");
    const hashtags = hashtag_list.reduce((hashtags, hashtag) => {
      return hashtags + ` #${hashtag}`;
    });

    try {
      const publishResult = await ig.publish.photo({
        file: imageBuffer,
        caption: `credits: u/${animeme_to_post.author}\n${animeme_to_post.title} ¯\\_(ツ)_/¯\n.\n.\n.\n.\n.\n#${hashtags}`,
      });

      console.log(animeme.data.url);

      if (publishResult.status === "ok") {
        // update list of posted memes

        posted_animemes[animeme.data.id] = animeme_to_post;
        fs.writeFileSync(
          posted_animemes_location,
          JSON.stringify(posted_animemes)
        );
        console.log("updated posted memes");
      }
    } catch (error) {
      console.log("work on fixing that image size thing you sucker");
    }
  });
  return "SUCCESS - UPLOADING NEW IMAGE MEMES";
};

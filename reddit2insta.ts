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

export const reddit2insta = async (
  ig_uname: string,
  ig_pass: string,
  subreddit: string
) => {
  // to be hydrated response
  const response = {
    login_status: "UNKNOWN",
    no_of_posts_made: 0,
  };

  // fetch list of previously posted memes
  let raw_pa = fs.readFileSync(posted_animemes_location);
  let posted_animemes: animeme_in_json = JSON.parse(raw_pa.toString());

  // logging into instagram
  const ig = new IgApiClient();
  ig.state.generateDevice(ig_uname);
  const auth = await ig.account.login(ig_uname, ig_pass);
  auth.pk ? console.log("SUCCESSFUL LOGIN") : console.log("LOGIN FAILED");
  auth.pk
    ? (response.login_status = "SUCCESS")
    : (response.login_status = "FAILED");

  // fetching memes from reddit
  const res = await axios.get(
    `https://www.reddit.com/r/${subreddit}/top.json?limit=10`
  );
  animemes = res.data.data.children;

  // checking if a meme previosly posted, if not posts
  let memes_processed = 0;
  animemes.forEach(async (animeme) => {
    // check if meme is image and previosly posted
    if (animeme.data.url.split(".")[0].split("://")[1] === "v") return null;
    if (posted_animemes[animeme.data.id]) return null;

    const animeme_to_post: animeme_to_insta = {
      title: animeme.data.title,
      author: animeme.data.author,
      url: animeme.data.url,
    };
    // try post meme... known causes of failure: image aspect ratio / size
    try {
      // generate buffer from image
      const imageBuffer = await get({
        url: animeme_to_post.url,
        encoding: null,
      });

      // try post
      const publishResult = await ig.publish.photo({
        file: imageBuffer,
        caption: `sauce: u/${animeme_to_post.author}\n${animeme_to_post.title} ¯\\_(ツ)_/¯\n.\n.\n.\n.\n.\n#animemes #reddit #redditmemes #anime #anime #manga #weeb #weebmemes #otaku #otakumemes`,
      });

      // update list of posted memes
      if (publishResult.status === "ok") {
        posted_animemes[animeme.data.id] = animeme_to_post;
        fs.writeFileSync(
          posted_animemes_location,
          JSON.stringify(posted_animemes)
        );
        response.no_of_posts_made = response.no_of_posts_made + 1;
        memes_processed++;
      }
    } catch (error) {
      console.log("work on fixing that image size thing you sucker");
      memes_processed++;
    }
    // returning a response
    if (memes_processed === animemes.length) return response;
  });
};

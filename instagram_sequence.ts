import { animeme_to_insta } from "./interfaces";
import Instagram from "instagram-web-api";

const { INSTAGRAM_USERNAME, INSTAGRAM_PASSWORD } = process.env;

export const instagramSequence = async (animeme: animeme_to_insta) => {
  const client = new Instagram({
    username: INSTAGRAM_USERNAME,
    password: INSTAGRAM_PASSWORD,
  });

  await client.login();

  await client.uploadPhoto({
    photo: animeme.url,
    caption: `sauce: u/${animeme.author}\n${animeme.title} ¯\\_(ツ)_/¯\n.\n.\n.\n.\n.\n#animemes #reddit #redditmemes #anime #anime #manga #weeb #weebmemes #otaku #otakumemes`,
    post: "feed",
  });
};

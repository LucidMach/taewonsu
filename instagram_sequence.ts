import { animeme_to_insta } from "./interfaces";
import Instagram from "./instagram-web-api/index";
const FileCookieStore = require("tough-cookie-filestore2");

const { username, password } = process.env;

export const instagramSequence = async (animeme: animeme_to_insta) => {
  const cookieStore = new FileCookieStore("./cookies.json");

  let status = "UNDEFINED";

  const client = new Instagram({
    username,
    password,
    cookieStore,
  });
  try {
    await client.login();
    // status = "LOGIN SUCCESS";

    await client.uploadPhoto({
      photo: animeme.url,
      caption: `sauce: u/${animeme.author}\n${animeme.title} ¯\\_(ツ)_/¯\n.\n.\n.\n.\n.\n#animemes #reddit #redditmemes #anime #anime #manga #weeb #weebmemes #otaku #otakumemes`,
      post: "feed",
    });
    status = "SUCCESS";
  } catch (error) {
    status = "LOGIN FAIL";
  }
  return status;
};

# TAEWONSU

a _customizable bot_ that takes **top memes** of the _day_ from `r/subreddit` and posts them on your [**instagram page**](https://www.instagram.com/taewonsu/)

# Guides

**1. Heroku SetUp Video Guide**

<div align="center">

[![Heroku SetUp Video Guide](https://img.youtube.com/vi/Wr-6jx4DILA/0.jpg)](https://youtu.be/Q9vDaU8piKc)

</div>

# SetUp

1.  install any LTS `nodejs` (latest recommended)

2.  clone/fork and clone to your local repository

    ```
    git clone https://github.com/LucidMach/taewonsu.git
    ```

3.  install all dependencies

    ```
    // using yarn
    yarn

    // using npm
    npm i
    ```

4.  create a file `.env` and set the following environment variables

    ```
    IG_USERNAME=#{your_username}
    IG_PASSWORD=#{your_password}
    R_SUB=#{subreddit_name}
    IG_HASHTAGS=#{list of hashtags}
    ```

    > **_NOTE:_** to **customize caption** you'll have to dig into the code **yourself**... cuz this project was started with the **major intention** being **creditting the original creators**

    > **_SIDE-NOTE:_** DO NOT type in the **#{}**

5.  test it locally on your machine with:

    ```
    // requires typescript so might need tsc being installed globally
    yarn dev

    // doesn't require typescript
    yarn start
    ```

6.  deploy...

    > this repo is **preconfigured** for a **heroku** deploy...

    > **don't forget** to include the **env variable** in heroku's **config variables**

7.  setup a `webhook` that'll trigger the bot every day/hr (IFTTT recommended)

    [IFTTT's guide to webhooks](https://ifttt.com/explore/what-is-a-webhook)

    **7.a.** create a new applet at [IFTTT](https://ifttt.com/create)

    ![IFTTT HOME](/assets/7a.png)

    **7.b.** set `if this` condition to **day and time**

    ![IFTTT IF THIS](/assets/7b.png)

    **7.c.** set applet to trigger at a specific time

    ![IFTTT DAY and TIME](/assets/7c.png)

    **7.d.** set `then that` condition to **webhooks**

    ![IFTTT THEN THAT](/assets/7d.png)

    **7.e.** set **URL** for _webhook_

    ![IFTT WebHooks](/assets/7e.png)

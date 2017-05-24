## Intro

This simple command line utility is for generating Twitter Floods from a paragraph of text. It accepts the paragraph as file and divides it into 140-char chunks then posts to Twitter by replying to the previous post. So creates a flood like below.

<img src="https://raw.github.com/gokhansengun/twitter-flood-generator/master/resources/example.png" width="640">

## Quick Start

Generating a Twitter flood is simple.

1. Clone the repo and run `npm install` in the root folder

2. Create a file named like `keys.sh` and fill it with below info then source it with `source keys.sh` using terminal.

    ```bash
    export TWITTER_CONSUMER_KEY="xxxx"
    export TWITTER_CONSUMER_SECRET="xxxx"
    export TWITTER_ACCESS_TOKEN_KEY="xxxx"
    export TWITTER_ACCESS_TOKEN_SECRET="xxxx"
    ```

3. Run below command to generate and post the Tweets.

    ```bash
    $ node main.js <file_name>
    ```

    Use `-d` option to see how tweets like before posting it to twitter.

    ```bash
    $ node main.js -d <file_name>
    ```


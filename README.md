## Intro

This simple command line utility is for generating Twitter Floods from a paragraph of text. It accepts the paragraph as file and divides it into 140-char chunks then posts to Twitter by replying to the previous post. So creates a flood like below.

<img src="https://raw.github.com/gokhansengun/twitter-flood-generator/master/resources/example.png" width="640">

## Quick Start - Local

Generating a Twitter flood is simple.

1. Clone the repo and run `npm install` in the root folder

2. Create a file named like `twitter-keys.env` and fill it with below info then source it with `source twitter-keys.env` using terminal.

    ```bash
    export TWITTER_CONSUMER_KEY=xxxx
    export TWITTER_CONSUMER_SECRET=xxxx
    export TWITTER_ACCESS_TOKEN_KEY=xxxx
    export TWITTER_ACCESS_TOKEN_SECRET=xxxx
    ```

3. Run below command to generate and post the Tweets.

    ```bash
    $ node main.js <file_name>
    ```

    Use `-d` option to see how tweets like before posting it to twitter.

    ```bash
    $ node main.js -d <file_name>
    ```

## Quick Start - Docker (thanks [@ozlerhakan](https://github.com/ozlerhakan))

1. Create an env file (let's say `twitter.env`) that contains the following envs:

    ```bash
    TWITTER_CONSUMER_KEY=xxxx
    TWITTER_CONSUMER_SECRET=xxxx
    TWITTER_ACCESS_TOKEN_KEY=xxxx
    TWITTER_ACCESS_TOKEN_SECRET=xxxx
    ```

2. Build the `dockerfile` of the project (Optional, you can use `gsengun/twitter-flood` image from DockerHub):

    ```
    $ docker build -f Dockerfile -t tfg .
    $ docker images
    REPOSITORY                 TAG                                        IMAGE ID            CREATED             SIZE
    tfg                        latest                                     7500a250bafa        1 hours ago         68.6MB
    ```

3. Let our text file `mytext` that needs to be posted on twitter be like:

    ```
    Ov yeah!
    ```

4. After building the image or just using existing docker image `gsengun/twitter-flood`, make a container tweeting the text on twitter on behalf of you:

    ```
    $ docker run --rm --env-file twitter.env -v $(pwd)/mytext:/mytext tfg:latest /mytext
    Updating status: Ov yeah!
    
    $ docker run --rm --env-file twitter.env -v $(pwd)/mytext:/mytext gsengun/twitter-flood:latest /mytext
    Updating status: Ov yeah!
    ```

require("dotenv").config({ path: __dirname + "/.env" });
const { twitterClient } = require("./twitterClient.js")
const CronJob = require("cron").CronJob;
const axios = require('axios');
const express = require('express')
const app = express()
const port = process.env.PORT || 4000;
const { download } = require("./utilities");

app.listen(port, () => {
    console.log(`Listening on port ${port}`)
})

const tweet = async () => {

    const imageResponse = await axios.get('https://cataas.com/cat?json=true');
    const imageUrl = 'https://cataas.com' + imageResponse.data.url;

    const uri = imageUrl;
    const filename = "cat.png";

    download(uri, filename, async function(){
        try {
            const mediaId = await twitterClient.v1.uploadMedia("./cat.png");
            await twitterClient.v2.tweet({
                text: "Testttt",
                media: {
                    media_ids: [mediaId]
                }
            });
        } catch (e) {
            console.log(e)
        }
    });
}

tweet();

const cronTweet = new CronJob("*/30 * * * * ", async () => {
    tweet();
});
  
cronTweet.start();



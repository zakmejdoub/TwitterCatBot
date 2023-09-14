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

const links = [
    'https://api.thecatapi.com/v1/images/search',
    'https://cataas.com/cat/gif?json=true'
];

const tweet = async () => {

    function chooseRandomLink() {
        const randomIndex = Math.floor(Math.random() * links.length);
        return links[randomIndex];
    }

    const imageApi = chooseRandomLink();
    let pictureFormat = '.jpg';

    if (imageApi.includes('gif')){
        pictureFormat = '.gif';
    }

    const imageResponse = await axios.get(imageApi);

    let imageUrl = '';

    if (pictureFormat == '.gif'){
        imageUrl = 'https://cataas.com/' + imageResponse.data.url;
    }else {
        imageUrl = imageResponse.data[0].url;
    }

    const uri = imageUrl;
    const filename = 'cat' + pictureFormat;

    download(uri, filename, async function(){
        try {
            const mediaId = await twitterClient.v1.uploadMedia('./cat' + pictureFormat);
            await twitterClient.v2.tweet({
                text: "",
                media: {
                    media_ids: [mediaId]
                }
            });
            const date = new Date();
            const time = date.toLocaleTimeString();     
            console.log('image sent at: ', time);
        } catch (e) {
            console.log(e)
            tweet();
        }
    });
}

tweet();
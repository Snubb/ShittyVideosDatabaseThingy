var express = require('express');
const pool = require('../database');
var router = express.Router();
var youtubeGen = require('../utils/youtubeGenerator');
const betterFetch = require('node-fetch');

router.get('/', async (req, res, next) => {
    const json = req.query.json;

    await pool.promise()
        .query('SELECT * FROM videos')
        .then(([rows, fields]) => {
            if (json == "true") {
                res.json(rows)
            } else {
                const data = {
                    message: "Displaying videos",
                    layout: 'layout.njk',
                    items: rows,
                    username: req.session.loginToken
                }
                res.render('videos.njk', data);
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                videos: {
                    error: "Cannot retrieve videos"
                }
            });
        });
});

router.get('/post', async (req, res, next) => {
    if (req.session.loginToken) {
        const data = {
            message: "Post a video",
            layout: 'layout.njk',
            title: 'Video posting',
            username: req.session.loginToken
        }
        res.render('postVideo.njk', data)
    } else {
        req.session.error = "Must be logged in to post video";
        res.redirect("/login");
    }
});

router.post('/post',
    async (req, res, next) => {
        const videoID = youtubeGen(req.body.videourl);
        const videoURL = "youtu.be/" + videoID; // Detta för att få alla länkar att ha samma format
        console.log("POST routes videoID: " + videoID);
        const username = req.session.loginToken;
        let title;
        let thumbnailurl;
        let channel;
        let key = process.env.YOUTUBE_API_KEY;
        let url = `https://youtube.googleapis.com/youtube/v3/videos?part=snippet%2CcontentDetails%2Cstatistics&id=${videoID}&key=${key}`
        let response;
        betterFetch(url)
            .then(res => res.json())
            .then(json => response = json.items[0].snippet)
            .then(async () => {
                title = response.title;
                thumbnailurl = response.thumbnails.high.url;
                channel = response.channelTitle;

                const sql = 'INSERT INTO videos (videourl, videoID, author, uploader, ratings, thumbnailurl, videoTitle) VALUES (?, ?, ?, ?, ?, ?, ?)';
                await pool.promise()
                    .query(sql, [videoURL, videoID, channel, username, '{}', thumbnailurl, title])
                    .then((response) => {
                        console.log(response);
                        if (response[0].affectedRows == 1) {
                            res.redirect('/videos');
                        } else {
                            res.status(400).json({
                                videos: {
                                    error: "Invalid video"
                                }
                            })
                        }
                    })
                    .catch(err => {
                        console.log(err);
                        res.status(500).json({
                            videos: {
                                error: "Cannot retrieve videos"
                            }
                        });
                    });
            });
    });

router.get('/:id', async (req, res, next) => {
    const videoID = req.params.id;
    const json = req.query.json;
    console.log("Vidoe ID: " + videoID);
    await pool.promise()
        .query('SELECT * FROM videos WHERE videoID = ?', [videoID])
        .then(([rows, fields]) => {
            if (rows.length != 0) {
                if (json == "true") {
                    res.json(rows)
                } else {
                    const data = {
                        message: "Displaying videos",
                        layout: 'layout.njk',
                        items: rows,
                        username: req.session.loginToken
                    }
                    res.render('videoID.njk', data);
                }
            } else {
                res.json({
                    tasks: {
                        error: "ID does not exist"
                    }
                });
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                tasks: {
                    error: "Cannot retrieve tasks"
                }
            });
        });
});
module.exports = router;

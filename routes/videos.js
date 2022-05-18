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
    const data = {
        message: "Post a video",
        layout: 'layout.njk',
        title: 'Video posting',
        username: req.session.loginToken
    }
    res.render('postVideo.njk', data)
});

router.post('/post',
    async (req, res, next) => {
        if (!req.session.loginToken) {
            return res.status(400).json({    
                error: "Must be logged in"
            })
        }
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

    const average_rating = await pool.promise()
            .query('SELECT AVG(ratings.rating) AS rating_average FROM ratings INNER JOIN videos ON ratings.video_id = videos.id AND videos.id = ?;', [21])
            .then(([rows]) => {
                if (rows.length != 0) {
                    console.log(rows[0]);
                    return rows[0].rating_average;
                } else {
                    console.log("NO WORK");
                }
            });

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
                        username: req.session.loginToken,
                        average_rating: average_rating
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

router.post('/:id/rate',
    async (req, res, next) => {
        if (!req.session.loginToken) {
            return res.status(400).json({    
                error: "Must be logged in"
            })
        }
        const video_id = req.params.id;
        const username = req.session.loginToken;
        const rating = req.body.rating;

        const user_id = await pool.promise()
            .query('SELECT id FROM users WHERE name = ?', [username])
            .then(([rows]) => {
                if (rows.length != 0) {
                    console.log(rows[0]);
                    return rows[0].id;
                } else {
                    console.log("NO WORK");
                }
            });

        
        const sql = 'INSERT INTO ratings (video_id, user_id, rating) VALUES (?, ?, ?)';
        await pool.promise()
            .query(sql, [video_id, user_id, rating])
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


module.exports = router;

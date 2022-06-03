var express = require('express');
const pool = require('../database');
var router = express.Router();
var youtubeGen = require('../utils/youtubeGenerator');
const betterFetch = require('node-fetch');

router.get('/', async (req, res, next) => {
    const json = req.query.json;

    await pool.promise()
        .query('SELECT * FROM olrlut_videos')
        .then(([rows, fields]) => {
            if (json == "true") {
                res.json(rows)
            } else {
                const data = {
                    title: "Shitty videos",
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
            const data = {
                message: "Post a video",
                layout: 'layout.njk',
                title: 'Video posting',
                username: req.session.loginToken,
                error: "Must be logged in"
            }
            return res.render('postVideo.njk', data);
        };
        if (req.body.videourl.length < 17) {
            const data = {
                message: "Post a video",
                layout: 'layout.njk',
                title: 'Video posting',
                username: req.session.loginToken,
                error: "Invalid youtube link"
            }
            return res.render('postVideo.njk', data);
        };
        const videoID = youtubeGen(req.body.videourl);
        const videoURL = "youtu.be/" + videoID; // Detta för att få alla länkar att ha samma format
        console.log("POST routes videoID: " + videoID);
        const username = req.session.loginToken;
        let title;
        let channel;
        let key = process.env.YOUTUBE_API_KEY;
        let url = `https://youtube.googleapis.com/youtube/v3/videos?part=snippet%2CcontentDetails%2Cstatistics&id=${videoID}&key=${key}`
        let response;
        betterFetch(url)
            .then(res => res.json())
            .then(json => response = json.items[0].snippet).catch(err => {
                console.log(err);
                const data = {
                    message: "Post a video",
                    layout: 'layout.njk',
                    title: 'Video posting',
                    username: req.session.loginToken,
                    error: "Invalid youtube link"
                }
                return res.render('postVideo.njk', data);
            })
            .then(async () => {
                title = response.title;
                thumbnailurl = response.thumbnails.high.url;
                channel = response.channelTitle;

                const sql = 'INSERT INTO olrlut_videos (videoID, author, uploader, videoTitle) VALUES (?, ?, ?, ?)';
                await pool.promise()
                    .query(sql, [videoID, channel, username, title])
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
    let user_rating = null;
    const videoID = req.params.id;
    const json = req.query.json;
    console.log("Vidoe ID: " + videoID);
    const video_id = await pool.promise()
        .query('SELECT id FROM olrlut_videos WHERE videoID = ?;', [videoID])
        .then(([rows]) => {
            if (rows.length != 0) {
                console.log(rows[0]);
                return rows[0].id;
            } else {
                console.log("NO WORK");
            }
        });
    const average_rating = await pool.promise()
        .query('SELECT AVG(olrlut_ratings.rating) AS rating_average FROM olrlut_ratings INNER JOIN olrlut_videos ON olrlut_ratings.video_id = olrlut_videos.id AND olrlut_videos.id = ?;', [video_id])
        .then(([rows]) => {
            if (rows.length != 0) {
                console.log(rows[0]);
                return rows[0].rating_average;
            } else {
                console.log("NO WORK");
            }
        });

    if (req.session.loginToken) {
        console.log(req.session.loginToken);
        const user_id = await pool.promise()
            .query('SELECT id FROM olrlut_users WHERE name = ?;', [req.session.loginToken])
            .then((rows) => {
                return rows[0][0].id;
            })
        console.log(video_id);
        console.log(user_id);
        user_rating = await pool.promise()
            .query('SELECT olrlut_ratings.rating AS user_rating FROM olrlut_ratings INNER JOIN olrlut_videos ON olrlut_ratings.video_id = olrlut_videos.id AND olrlut_videos.id = ? AND user_id = ?;', [video_id, user_id])
            .then((rows, fields) => {
                console.log("HERES THE ROWS")
                console.log(rows)
                if (rows.length != 0) {
                    return rows[0][0].user_rating;
                } else {
                    return 0;
                }
            })
    }

    await pool.promise()
        .query('SELECT * FROM olrlut_videos WHERE videoID = ?', [videoID])
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
                        average_rating: average_rating,
                        user_rating: user_rating
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
        if (rating < 0 || rating > 10) {
            return res.status(400).json({
                error: "Must input a number between 0 and 10"
            })
            return 
        }

        const user_id = await pool.promise()
            .query('SELECT id FROM olrlut_users WHERE name = ?', [username])
            .then(([rows]) => {
                if (rows.length != 0) {
                    console.log(rows[0]);
                    return rows[0].id;
                } else {
                    console.log("NO WORK");
                }
            });

        await pool.promise()
            .query('SELECT * FROM olrlut_ratings WHERE user_id = ? AND video_id = ?', [user_id, video_id])
            .then(async ([rows]) => {
                if (rows.length == 0) {
                    const sql = 'INSERT INTO olrlut_ratings (video_id, user_id, rating) VALUES (?, ?, ?)';
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
                } else {
                    res.status(500).json({
                        videos: {
                            error: "You have already rated this video"
                        }
                    });
                }
            });


    });

router.post('/:id/delete',
    async (req, res, next) => {
        const video_id = req.params.id;
        const username = req.session.loginToken;

        const sql = 'DELETE FROM olrlut_videos WHERE id = ?';
        await pool.promise().query(sql, [video_id])
            .then((response) => {
                if (response[0].affectedRows === 1) {
                    req.session.flash = "Task deleted";
                    res.redirect('back');
                } else {
                    req.session.flash = "Task failed";
                    res.redirect('back');
                }
            });
    });


module.exports = router;

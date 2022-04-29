var express = require('express');
const pool = require('../database');
var router = express.Router();

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
        const videoURL = req.body.videourl;
        const videoID = videoURL.split('v=')[1];
        const username = req.session.loginToken;

        
        const sql = 'INSERT INTO videos (videourl, videoID, author, uploader) VALUES (?, ?, ?, ?)';
        await pool.promise()
        .query(sql, [videoURL, videoID, 'Oliver', username])
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

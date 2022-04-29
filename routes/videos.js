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
                    items: rows
                }


                res.render('videos.njk', data);
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                tasks: {
                    error: "Cannot retrieve videos"
                }
            });
        });
});

router.get('/post', async (req, res, next) => {
    const data = {
        message: "Post a video",
        layout: 'layout.njk',
        title: 'Video posting'
    }
    res.render('postVideo.njk', data)
});

router.post('/post',
    async (req, res, next) => {
        const videoURL = req.body.videourl;
        const videoID = videoURL.split('v=')[1];


        const sql = 'INSERT INTO videos (videourl, videoID, author, uploader) VALUES (?, ?, ?, ?)';
        await pool.promise()
        .query(sql, [videoURL, videoID, 'Oliver', 'Oliver'])
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

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

module.exports = router;

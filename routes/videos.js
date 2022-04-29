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
                res.render('layout.njk');
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

module.exports = router;

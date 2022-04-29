var express = require('express');
const pool = require('../database');
var router = express.Router();

router.get('/', async (req, res, next) => {
    await pool.promise()
        .query('SELECT * FROM videos')
        .then(([rows, fields]) => {
            res.json(rows)
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

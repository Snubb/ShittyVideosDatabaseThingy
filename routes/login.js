var express = require('express');
var router = express.Router();
const pool = require('../database');

const bcrypt = require('bcrypt');


/* GET users listing. */
router.get('/', async (req, res, next) => {
    if (req.session.loginToken) {
        return res.redirect("/profile");
    }
    await pool.promise()
        .query('SELECT * FROM users')
        .then(([rows, fields]) => {
            res.render('login.njk', { title: 'Express', error: req.session.error, flash: req.session.flash, token: req.session.loginToken});
            req.session.error = null;
            req.session.flash = null;
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                users: {
                    error: "Error getting users"
                }
            })
        });

});
router.post('/', async (req, res, next) => {
    const username = req.body.username;
    
    if (username.length > 0 && req.body.password.length > 0) {
        await pool.promise()
            .query('SELECT * FROM users WHERE name = ?', [username])
            .then(([rows, fields]) => {
                console.log(rows);
                bcrypt.compare(req.body.password, rows[0].password, function(err,result) {
                    if (result) {
                        req.session.loginToken = username;
                        req.session.uid = rows[0].id;
                        res.redirect("/videos", );
                    } 
                    else {
                        req.session.error = "Wrong password/username";
                        res.redirect("/login");
                    }
                });
            })
            .catch(err => {
                req.session.error = "Wrong password/username";
                res.redirect("/login");
            });
    } else {
        req.session.error = "must input values";
        res.redirect("/login")
    }
});
router.post('/logout', async (req, res, next) => {
    req.session.loginToken = null;
    res.redirect("/login");    
});

module.exports = router;

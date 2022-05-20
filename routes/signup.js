var express = require('express');
const { redirect } = require('express/lib/response');
const pool = require('../database');
var router = express.Router();
const bcrypt = require('bcrypt');
const { hash } = require('bcrypt');


/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render("newSignup.njk", {error: req.session.error, token: req.session.loginToken});
  req.session.error = null;
});

router.post('/', async (req, res, next) => {
    if (req.body.password == req.body.rePassword) {
      if (req.body.password.length > 7 
      && req.body.password.length < 33
      && req.body.password != req.body.password.toLowerCase() 
      && req.body.password != req.body.password.toUpperCase() 
      /*&& req.body.password.includes('0', '1', '2', '3', '4', '5', '6', '7', '8', '9')*/) {
        if (req.body.username.length > 3 && req.body.username.length < 33) {
          await pool.promise()
          .query("SELECT * FROM users WHERE name = ?", [req.body.username])
          .then(([rows]) => {
            if (rows.length > 0) {
              req.session.error = "Username already taken";
              return res.redirect("/signup");
            }
          });
          bcrypt.hash(req.body.password, 10, async function(err, hash) {
            await pool.promise()
            .query("INSERT INTO users (name, password) VALUES (?, ?)", [req.body.username, hash])
            .then(([rows]) => {
                req.session.flash = "Created user";
                res.redirect("/login");
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
          
          
        } else {
          req.session.error = "Username invalid";
          res.redirect("/signup");
        }

      } else {
        req.session.error = "Password invalid";
        res.redirect("/signup");
      }
    } else {
      req.session.error = "Failed to repeat password"
      res.redirect("/signup");
    }
});

module.exports = router;

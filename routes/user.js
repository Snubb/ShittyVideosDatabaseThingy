var express = require('express');
const pool = require('../database');
var router = express.Router();


/* GET users listing. */
router.get('/', async (req, res, next) => {
  if (!req.session.loginToken) {
    req.session.error = "You are not logged in";
    return res.redirect("/login");
  }
  await pool.promise()
  .query('SELECT * FROM olrlut_videos JOIN olrlut_users ON olrlut_users.name = olrlut_videos.uploader WHERE olrlut_videos.uploader = ?', [req.session.loginToken])
  .then(([rows, fields]) => {
    newRows = rows.splice(0, 3);
    res.render("user.njk", {title: "Profile",data: newRows, displayeduser: req.session.loginToken, username: req.session.loginToken})
  })
});

router.get('/:user', async (req, res, next) => {
  username = req.params.user;
  await pool.promise()
  .query('SELECT * FROM olrlut_users WHERE name = ?', [username])
  .then(([rows]) => {
    console.log(rows)
    console.log(rows.length)
    if (rows.length == 0) {
      console.log("empty")
      res.json({
        tasks: {
            error: "ID does not exist"
        }
      });
      return;
    }  
  });
  await pool.promise()
  .query('SELECT * FROM olrlut_videos JOIN olrlut_users ON olrlut_users.name = olrlut_videos.uploader WHERE olrlut_videos.uploader = ?', [username])
  .then(([rows, fields]) => {
    newRows = rows.splice(0, 3);
    res.render("user.njk", {title: "User page", data: newRows, displayeduser: username, username: req.session.loginToken})
  })
});

router.get('/:user/videos', async (req, res, next) => {
  username = req.params.user;
  await pool.promise()
  .query('SELECT * FROM olrlut_users WHERE name = ?', [username])
  .then(([rows]) => {
    console.log(rows)
    console.log(rows.length)
    if (rows.length == 0) {
      res.json({
        tasks: {
            error: "ID does not exist"
        }
      });
      return;
    }  
  });
  await pool.promise()
  .query('SELECT * FROM olrlut_videos WHERE uploader = ?', [username])
  .then(([rows, fields]) => {
    res.render("uservideos.njk", {items: rows, username: username})
  })
});
module.exports = router;

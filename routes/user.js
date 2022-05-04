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
  .query('SELECT * FROM videos JOIN users ON users.name = videos.uploader WHERE videos.uploader = ?', [req.session.loginToken])
  .then(([rows, fields]) => {
    console.log(rows);
      res.render("user.njk", {data: rows, name: req.session.loginToken})
  })
});
module.exports = router;

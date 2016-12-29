var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Pomodoro' });
});

router.post('/', function(req, res) {
  console.log(req.body.work);
  console.log(req.body.rest);
});

module.exports = router;

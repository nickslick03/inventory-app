var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { header: 'Buy somethin\' will ya?' });
});

module.exports = router;

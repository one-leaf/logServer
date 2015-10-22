/**
 * Created by oneleaf on 15/10/21.
 */
var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
    res.render('about');
});

module.exports = router;

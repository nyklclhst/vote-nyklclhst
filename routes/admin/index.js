var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  const cookie = req.cookies.login;
  if(cookie === undefined){
    res.redirect(301,'/');
  } else {
    res.render('admin/index');
  }
});

router.post('/logout',function(req,res,next){
  res.clearCookie('login');
  res.redirect(301,'/');
});

module.exports = router;
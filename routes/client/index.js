var express = require('express');
const mysql = require('mysql');
var router = express.Router();

function sql_connect(){
  return mysql.createConnection({
      host: "localhost",
      user: "tubes",
      password: "password_tubes",
      database: "tubes"
  });
}

/* GET users listing. */
router.get('/', function(req, res, next) {
  const cookie = req.cookies.login;
  if(cookie === undefined){
    res.redirect(301,'/');
  } else {
    res.render('dashboard/index');
  }
});

router.post('/logout',function(req,res,next){
  res.clearCookie('login');
  res.redirect(301,'/');
});

router.post('/addEvent', function(req,res,next){
  const eventname = req.body.eventName,
  startvote = Date.parse(req.body.startVote) / 1000,
  endvote = Date.parse(req.body.endVote) / 1000,
  code = req.body.code,
  con = sql_connect();
  // con.connect(function(err){
  //   if(err){
  //     console.log(err);
  //     res.render('dashboard/index')
  //   }
  // })

  console.log(req.baseUrl);
});

module.exports = router;
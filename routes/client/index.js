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

function makeid() {
  var length = 5;
  var result = '';
  var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var charactersLength = characters.length;
  for ( var i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
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
  res.clearCookie('username');
  res.redirect(301,'/');
});

router.post('/addEvent', function(req,res,next){
  const eventname = req.body.eventName,
  startvote = req.body.startVote,
  endvote = req.body.endVote,
  code = makeid(),
  con = sql_connect();
  con.connect(function(err){
    if(err){
      console.log(err);
      res.redirect(301,'/');
    } else {
      const sql = 'insert into events(event_name,start_vote,end_vote,code,owner_id) values (?,?,?,?,(select id from users where users.username = ?))';
      con.query(sql,[eventname,startvote,endvote,code,req.cookies.username], function(error,resp,fields){
        if(error){
          console.log(error)
          res.redirect(301,'/');
        } else {
          res.redirect(301,'/');
        }
      })
    }
    con.end();
  })
});

module.exports = router;
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

/* GET home page. */
router.get('/', function(req, res, next) {
  let username = [];
  let event = [];
  let waktu = [];
  let voted = [];
  const con = sql_connect();
  con.connect(function(err){
    if(err){
      console.log(err);
      res.render('admin/history',{user_name: null, event: null, waktu: null, voted: null});
    } else {
      const sql = "select b.user_name,c.event_name,a.waktu_vote,a.voted from voting_data a left join \
        users b on (b.id = a.user_id) left join events c on (c.id = a.event_id) where b.role != 'admin'";
        con.query(sql,function(error,resp,fields){
          if(error){
            console.log(error);
            res.render('admin/history',{user_name: null, event: null, waktu: null, voted: null});
          } else {
            for(var i = 0; i<resp.length; i++){
              username.push(resp[i].user_name);
              event.push(resp[i].event_name);
              if(resp[i].waktu_vote == null){
                waktu.push('-');
              } else {
                waktu.push(resp[i].waktu_vote);
              }
              voted.push(resp[i].voted);
            }
            res.render('admin/history',{user_name: username, event: event, waktu: waktu, voted: voted});
          }
      })
    }
    con.end();
  })
});

module.exports = router;
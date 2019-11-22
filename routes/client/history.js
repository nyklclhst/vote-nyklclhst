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

router.get('/', function(req,res,next){
    const username = req.cookies.username,
    cookie = req.cookies.login,
    db = sql_connect();
    let event = [],
    waktu = [],
    voted = [];
    if(cookie === undefined){
        res.redirect(301, '/');
    } else {
        db.connect(function(err){
            if(err){
                console.log(err);
                res.render('dashboard/history',{event: event, voted: voted, waktu: waktu});
            } else {
                const sql = "select a.event_name,b.voted,b.waktu_vote from voting_data b left join\
                    events a on (a.id = b.event_id) where user_id = (select id from users where\
                    users.username = ?)";
                db.query(sql,[username],function(error,resp){
                    if(error){
                        console.log(error);
                        res.render('dashboard/history',{event: event, voted: voted, waktu: waktu});
                    } else {
                        for(let i=0;i<resp.length;i++){
                            event.push(resp[i].event_name);
                            voted.push(resp[i].voted);
                            if(resp[i].waktu_vote == null){
                                waktu.push('-');
                            } else {
                                waktu.push(resp[i].waktu_vote);
                            }
                        }
                        res.render('dashboard/history',{event: event, voted: voted, waktu: waktu});
                    }
                })
            }
            db.end();
        })
    }
})

module.exports = router;
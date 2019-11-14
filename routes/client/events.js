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
  let event_name = [],
    start_vote = [],
    end_vote = [],
    code = [];
  if(cookie === undefined){
    res.redirect(301,'/');
    // console.log(cookie);
  } else {
    const con = sql_connect();
    con.connect(function(err){
        if(err){
            console.log(err);
            res.render('dashboard/events',{event_name: event_name, start_vote: start_vote, end_vote: end_vote, code: code});            
        } else {
            let temp = cookie.split('//');
            const sql = 'select * from events where id=?';
            con.query(sql,[temp[1]],function(error,resp,fields){
                if(error){
                    console.log(error);
                    res.render('dashboard/events',{event_name: event_name, start_vote: start_vote, end_vote: end_vote, code: code});
                } else {
                    for(var i=0;i<resp.length;i++){
                        event_name.push(resp[i].event_name);
                        start_vote.push(resp[i].start_vote);
                        end_vote.push(resp[i].end_vote);
                        code.push(resp[i].code);
                    }
                    res.render('dashboard/events',{event_name: event_name, start_vote: start_vote, end_vote: end_vote, code: code});
                }
            });
        }
        con.end();
    });
  }
});

module.exports = router;
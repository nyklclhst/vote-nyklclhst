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
    code = [],
    owner = [];
  if(cookie === undefined){
    res.redirect(301,'/');
  } else {
    const con = sql_connect();
    con.connect(function(err){
        if(err){
            console.log(err);
            res.render('admin/events',{event_name: event_name, start_vote: start_vote, end_vote: end_vote, code: code});            
        } else {
            const sql = 'select * from events';
            con.query(sql,function(error,resp,fields){
                if(error){
                    console.log(error);
                    res.render('admin/events',{event_name: event_name, start_vote: start_vote, end_vote: end_vote, code: code, owner: owner});
                } else {
                    for(var i=0;i<resp.length;i++){
                        event_name.push(resp[i].event_name);
                        start_vote.push(resp[i].start_vote);
                        end_vote.push(resp[i].end_vote);
                        code.push(resp[i].code);
                        owner.push(resp[i].owner_id);
                    }
                    res.render('admin/events',{event_name: event_name, start_vote: start_vote, end_vote: end_vote, code: code, owner: owner});
                }
            });
        }
        con.end();
    });
  }
});

module.exports = router;
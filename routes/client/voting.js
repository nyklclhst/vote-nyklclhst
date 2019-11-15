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
    const db = sql_connect();
    const cookie = req.cookies.login;
    let temp = cookie.split('//');
    let nama_event = [],
    start_vote = [],
    end_vote = [];
    if(cookie === undefined){
        res.redirect(301,'/');
    } else{
        const sql = 'select b.event_name,b.start_vote,b.end_vote from voting_data a \
            left join events b on (b.id = a.event_id) where a.user_id = ?';
        db.connect(function(err){
            if(err){
                console.log(err)
                res.redirect(301,req.path);
            } else {
                db.query(sql,[temp[1]], function(err,resp){
                    if(err){
                        console.log(err);
                        res.render('dashboard/voting',{nama_event: nama_event, start_vote: start_vote, end_vote: end_vote});
                    } else {
                        for(let i=0;i<resp.length;i++){
                            nama_event.push(resp[i].event_name);
                            start_vote.push(resp[i].start_vote);
                            end_vote.push(resp[i].end_vote);
                        }
                        res.render('dashboard/voting',{nama_event: nama_event, start_vote: start_vote, end_vote: end_vote});
                    }
                })
            }
            db.end();
        })
    }
});

router.post('/joinEvent', function(req,res,next){
    const db = sql_connect(),
    code = req.body.code,
    cookie = req.cookies.login,
    sql = 'insert into voting_data(user_id,event_id) value(?,(select id from events where events.code = ?))';
    let temp = cookie.split('//');
    db.connect(function(err){
        if(err){
            console.log(err);
            res.redirect(301,'/dashboard/voting');
        } else {
            db.query(sql,[temp[1],code], function(error,rest,fields){
                if(error){
                    console.log(error);
                    res.redirect(301,'/dashboard/voting');
                } else {
                    console.log('Sukses!');
                    res.redirect(301,'/dashboard/voting');
                }
            });
        }
        db.end();
    });
})

module.exports = router;
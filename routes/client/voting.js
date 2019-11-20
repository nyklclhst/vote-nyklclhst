var express = require('express');
var url = require('url');
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
    code = [],
    end_vote = [];
    if(cookie === undefined){
        res.redirect(301,'/');
    } else{
        const sql = 'select b.event_name,b.start_vote,b.end_vote,b.code from voting_data a \
            left join events b on (b.id = a.event_id) where a.user_id = ?';
        db.connect(function(err){
            if(err){
                console.log(err)
                res.redirect(301,req.path);
            } else {
                db.query(sql,[temp[1]], function(error,resp){
                    if(error){
                        console.log(error);
                        res.render('dashboard/voting',{nama_event: nama_event, start_vote: start_vote, end_vote: end_vote, code: code});
                    } else {
                        for(let i=0;i<resp.length;i++){
                            if(nama_event != null){
                                nama_event.push(resp[i].event_name);
                                start_vote.push(resp[i].start_vote);
                                end_vote.push(resp[i].end_vote);
                                code.push(resp[i].code);
                            }
                        }
                        res.render('dashboard/voting',{nama_event: nama_event, start_vote: start_vote, end_vote: end_vote, code: code});
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

router.get('/vote', function(req,res,next){
    const db = sql_connect(),
    user_id = req.cookies.login.split('//');
    db.connect(function(err){
        if(err){
            console.log(err);
            res.redirect(301,'/dashboard/voting');
        } else {
            let sql = 'select voted from voting_data where user_id=? limit 1';
            db.query(sql,[user_id[1]], function(error,resp){
                if(error){
                    console.log(error);
                    res.redirect(301,'/dashboard/voting');
                } else {
                    console.log(resp[0].voted);
                    if(resp[0].voted == 'No'){
                        console.log('not voted');
                        res.redirect(301, '/dashboard'+req.url);
                    } else {
                        console.log('voted');
                        res.redirect(301,'/dashboard/voting');
                    }
                }
            });
        }
        db.end();
    });
})

module.exports = router;
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

router.get('/', function(req,res,next){
    const code = url.parse(req.url,true).query.code;
    const db = sql_connect();
    let calon_name = [],
    parpol = [],
    id = [],
    vote = [],
    img = [];
    db.connect(function(err){
        if(err){
            console.log(err);
            res.redirect(301, '/dashboard/voting');
        } else {
            const sql = 'select * from calon where event_id=(select id from events where code=?)';
            db.query(sql,[code],function(error,resp){
                if(error){
                    console.log(error);
                    res.redirect(301, '/dashboard/voting');
                } else {
                    for(let i=0;i<resp.length;i++){
                        calon_name.push(resp[i].calon_name);
                        parpol.push(resp[i].parpol);
                        img.push('/images/calon_p/'+resp[i].image);
                        id.push(resp[i].id);
                        vote.push(resp[i].jumlah_vote);
                    }
                    res.render('dashboard/vote_page',{img: img, calon_name: calon_name, id: id, parpol: parpol, vote: vote});
                }
            })
        }
    })
})

router.post('/',function(req,res,next){
    const code = url.parse(req.url,true).query.code,
    current = new Date();
    date = current.getFullYear() + '-' + (current.getMonth() + 1) + '-' + current.getDate();
    let temp = req.body.calon.split('/');
    const db = sql_connect(),
    before = temp[1],
    id = temp[0];
    console.log(date);
    db.connect(function(err){
        if(err){
            console.log(err);
            res.redirect(301,'/dashboard'+req.url);
        } else {
            let sql = 'update calon,voting_data set calon.jumlah_vote = ?, voting_data.calon_id=?,\
                voting_data.voted=?, voting_data.waktu_vote=? where calon.id=? and\
                voting_data.event_id=(select id from events where code=?)';
            const after = parseInt(before) + 1;
            db.query(sql,[after,id,'Yes',date,id,code],function(error,resp){
                if(error){
                    console.log(error);
                    res.redirect(301,'/dashboard'+req.url);
                } else {
                    console.log('Sukses vote');
                    res.redirect(301,'/dashboard/');
                }
            })
        }
        db.end();
    })
})

module.exports = router;
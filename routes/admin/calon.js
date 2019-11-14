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
  let calon_name = [],
    parpol = [],
    image = [],
    event_id = [],
    jum_vote = [];
  if(cookie === undefined){
    res.redirect(301,'/');
  } else {
    const con = sql_connect();
    con.connect(function(err){
        if(err){
            console.log(err);
            res.render('admin/calon',{calon_name: calon_name, parpol: parpol, image: image, event_id: event_id, jum_vote: jum_vote});
        } else {
            const sql = 'select * from calon';
            con.query(sql,function(error,resp,fields){
                if(error){
                    console.log(error);
                    res.render('admin/calon',{calon_name: calon_name, parpol: parpol, image: image, event_id: event_id, jum_vote: jum_vote});
                } else {
                    for(var i=0;i<resp.length;i++){
                        calon_name.push(resp[i].calon_name);
                        parpol.push(resp[i].parpol);
                        image.push(resp[i].image);
                        event_id.push(resp[i].event_id);
                        jum_vote.push(resp[i].jumlah_vote);
                    }
                    res.render('admin/calon',{calon_name: calon_name, parpol: parpol, image: image, event_id: event_id, jum_vote: jum_vote});
                }
            });
        }
        con.end();
    });
  }
});

module.exports = router;
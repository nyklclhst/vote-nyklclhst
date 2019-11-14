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
  let calon = [];
  let event = [];
  let suara = [];
  const con = sql_connect();
  con.connect(function(err){
    if(err){
      console.log(err);
      res.render('suara',{calon: null, event: null, suara: null});
    } else {
      const sql = "select b.calon_name, b.jumlah_vote, c.event_name from voting_data a left \
        join calon b on (b.id = a.calon_id) left join events c on (c.id = a.event_id)";
      con.query(sql,function(error,resp,fields){
          if(err){
            console.log(error);
            res.render('suara',{calon: null, event: null, suara: null});
          } else {
            for(var i = 0; i<resp.length;i++){
              calon.push(resp[i].calon_name);
              event.push(resp[i].event_name);
              suara.push(resp[i].jumlah_vote);
            }
            res.render('suara',{calon: calon, event: event, suara: suara});
          }
      })
    }
  })
});

module.exports = router;
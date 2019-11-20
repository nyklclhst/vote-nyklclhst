var express = require('express');
const mysql = require('mysql');
var path = require('path');
var multer = require('multer');
var router = express.Router();

const storage = multer.diskStorage({
  destination: path.join(__dirname, './../../public/images/calon_p'),
  filename: function(req, file, cb){
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
})

const upload = multer({
  storage: storage
});

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
            const sql = 'select * from events where owner_id=?';
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

router.post('/',upload.single('calon_img'), function(req,res,next){
    const code = req.body.code,
    name_calon = req.body.calon_name,
    event_name = req.body.event_name,
    img = req.file.filename;
    parpol_calon = req.body.parpol_calon,
    conn = sql_connect();
    conn.connect(function(err){
        if(err){
            console.log(err);
            res.redirect(301,'/dashboard/events');
        } else {
            const sql = 'insert into calon(calon_name,parpol,image,event_id) values(?,?,?,(select id from events where code=? and event_name=?))';
            conn.query(sql,[name_calon,parpol_calon,img,code,event_name], function(error,resp){
                if(error){
                    console.log(error);
                    res.redirect(301,'/dashboard/events');
                } else {
                    console.log('Input success');
                    res.redirect(301,'/dashboard/events');
                }
            })
        }
        conn.end();
    })
})

router.post('/delete', function(req,res,next){
    const code = req.body.code,
    conn = sql_connect();
    conn.connect(function(err){
        if(err){
            console.log(err);
            res.redirect(301,'/dashboard/events');
        } else {
            const sql = 'delete from events where code=?';
            conn.query(sql,[code],function(error,resp){
                if(error){
                    console.log(error);
                    res.redirect(301,'/dashboard/events');
                } else {
                    console.log('Delete Success');
                    res.redirect(301,'/dashboard/events');
                }
            })
        }
        conn.end();
    })
})

module.exports = router;
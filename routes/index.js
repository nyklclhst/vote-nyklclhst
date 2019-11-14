var express = require('express');
const mysql = require('mysql');
const crypto = require('crypto');
var router = express.Router();
const adminCookie = 'daa00ad92f1b0e78e496c3aed4e8065bea33fdca18d34f9994e2181ac3a64886c2b89cc7630b56ded07288a91a6f7758e321f48c4e57ca7dd7e487077610e86c';

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
  const cookie = req.cookies.login;
  if(cookie === undefined){
    res.render('index');
  } else {
    if(cookie === adminCookie){
      console.log('sama');
    } else {
      console.log('beda');
    }
    if(cookie == adminCookie){
      res.redirect(301,'/admin/');
    } else {
      res.redirect(301,'/dashboard/');
    }
  }
});

router.post('/login',function(req,res,next){
  const hash = crypto.createHash('sha512'),
  con = sql_connect(),
  uname = req.body.username,
  pass = hash.update(req.body.password,'utf8').digest('hex');
  con.connect(function(err){
      if(err){
          console.log(err);
          res.redirect(301,'/');
      } else {
        const sql = 'select id,username,password,role from users where username= ? and password= ? limit 1';
        con.query(sql,[uname, pass],function(error,resp){
            if(error){
                console.log(error);
                res.redirect(301,'/');
            }
            if(resp.length === 1){
                const hash1 = crypto.createHash('sha512');
                if(resp[0].role === 'Admin'){
                    console.log('Success Login as Admin');
                    let temp = Buffer.from(uname,'utf8').toString('hex')+'//'+
                        Buffer.from('nyklclhst','utf8').toString('hex')+'//'+
                        Buffer.from(resp[0].role,'utf8').toString('hex');
                    temp = hash1.update(temp,'utf8').digest('hex');
                    res.cookie('login',temp,{maxAge: 900000});
                    res.cookie('username',uname,{maxAge: 900000});
                    res.redirect(301,'/admin/');
                } else {
                    console.log('Success Login as User');
                    let temp = Buffer.from(uname,'utf8').toString('hex')+'//'+
                        Buffer.from('nyklclhst','utf8').toString('hex')+'//'+
                        Buffer.from(resp[0].role,'utf8').toString('hex');
                    temp = hash1.update(temp,'utf8').digest('hex')+'//'+resp[0].id;
                    res.cookie('login',temp,{maxAge: 900000});
                    res.cookie('username',uname,{maxAge: 900000});
                    res.redirect(301,'/dashboard/');
                }
            }
            if(resp.length < 1){
                console.log('Wrong Username or Password');
                res.redirect(301,'/');
            }
        });
      }
      con.end();
  });
});

router.post('/regis',function(req,res,next){
  const hash = crypto.createHash('sha512'),
   con = sql_connect(),
   uname = req.body.username,
   pass = hash.update(req.body.password,'utf8').digest('hex'),
   email = req.body.email;
  con.connect(function(err){
    if(err){
      console.log(err);
      res.redirect(301,'/');
    } else {
      const sql = 'insert into users (username,password,email,user_name) values(?,?,?,?)';
      con.query(sql,[uname,pass,email,uname],function(error,resp){
        if(error){
          console.log(error);
          res.redirect(301,'/');
        } else {
          console.log('Registration Succesfully');
          res.render('index');
        }
      });
    }
    con.end();
  });
});

module.exports = router;
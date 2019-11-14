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
  let username = [],
    email = [],
    role = [],
    name = [];
  if(cookie === undefined){
    res.redirect(301,'/');
  } else {
    const con = sql_connect();
    con.connect(function(err){
        if(err){
            console.log(err);
            res.render('admin/users',{username: username, email: email, role: role, name: name});
        } else {
            const sql = 'select * from users';
            con.query(sql,function(error,resp,fields){
                if(error){
                    console.log(error);
                    res.render('admin/users',{username: username, email: email, role: role, name: name});
                } else {
                    for(var i=0;i<resp.length;i++){
                        username.push(resp[i].username);
                        email.push(resp[i].email);
                        role.push(resp[i].role);
                        name.push(resp[i].user_name);
                    }
                    res.render('admin/users',{username: username, email: email, role: role, name: name});
                }
            });
        }
        con.end();
    });
  }
});

module.exports = router;
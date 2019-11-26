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

router.get('/', function(req,res,next){
    const cookie = req.cookies.login.split('//'),
    id = cookie[1],
    query = 'select username,password,email from users where id=? limit 1',
    db = sql_connect();
    let username = [],
    email = [],
    password = [];
    if(req.cookies.login === undefined){
        res.redirect(301,'/');
    } else {
        db.connect(function(err){
            if(err){
                console.log(err);
                res.render('dashboard/profile',{username: username, email: email});
            } else {
                db.query(query,[id],function(error,rest){
                    if(error){
                        console.log(error);
                        res.render('dashboard/profile',{username: username, email: email});
                    } else {
                        for(let i=0;i<rest.length;i++){
                            username.push(rest[i].username);
                            password.push(rest[i].password);
                            email.push(rest[i].email);
                        }
                        res.render('dashboard/profile',{username: username, email: email});
                    }
                })
            }
            db.end();
        })
    }
})

module.exports = router;
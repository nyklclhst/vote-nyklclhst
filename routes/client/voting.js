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
    if(cookie === undefined){
        res.redirect(301,'/');
    } else{
        const sql = 'select image from calon';
        db.connect(function(err){
            if(err){
                console.log(err)
                res.redirect(301,'/');
            } else {
                db.query(sql, function(err,resp){
                    if(err){
                        console.log(err);
                        res.render('dashboard/voting');
                    } else {
                        res.render('dashboard/voting');
                    }
                })
            }
        })
    }
});

module.exports = router;
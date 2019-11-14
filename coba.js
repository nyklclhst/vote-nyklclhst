var mysql = require('mysql');
var crypto = require('crypto');
var hash = crypto.createHash('sha512');

function sql_con(){
    return mysql.createConnection({
        host: "localhost",
        user: "tubes",
        password: "password_tubes",
        database: "tubes"
    });
}

var con = sql_con();
const uname = "admin"
const pass = hash.update("admin",'utf8').digest('hex');
con.connect(function(err){
  if(err){
      console.log(err);
      res.render('login');
  };
  const sql = 'select username,password,role from users where username = ? and password = ?'
  con.query(sql,[uname, pass],function(error,resp){
      if(err){
          console.log(error);
      } else {
        console.log(resp[0].role);
      }
      // console.log(sql);
  });
  con.end();
});
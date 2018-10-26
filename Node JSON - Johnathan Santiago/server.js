var express = require('express')
var passport = require('passport');
var TwitterStrategy = require('passport-twitter').Strategy;
var ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn;
var app = express();
var fs = require("fs");
var JsonDB = require("node-json-db");
var bodyParser = require("body-parser");
var url = require('url');
var logado = false; 

var USUARIO = "admin";
var SENHA = "admin";

const jsonFileName = "public/fan.json";
// Create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({ extended: false });

var server = app.listen(8081, function() {
  const host = server.address().address;
  const port = server.address().port;

  console.log("Example app listening at http://%s:%s", host, port);

});


app.get("/delete", function(req, res) {

var q = url.parse(req.url, true).query;
var id = q.id;
console.log("ID "+id)
let obj;
fs.readFile('./public/fan.json', 'utf8', function(err, dados)
{
   obj = JSON.parse(dados);
   console.log("OBJ 1"+obj.fans)

   obj.fans.splice(id, 1);
   //obj.fans.splice(id);
   console.log("OBJ 2"+obj.fans)
   fs.writeFile('./public/fan.json', JSON.stringify(obj), function
  (err) {
   if (err) throw err;
   console.log('Arquivo substituido');
  });
 }); 
});

app.post("/add", urlencodedParser, function(req, res) {
  // Prepare output in JSON format
  response = {
    team: req.body.team,
    name: req.body.name
  };

  let db = new JsonDB(jsonFileName, true, false);
  db.push(
    "/fans[]",
    { id: Math.floor(Math.random() * 100000) ,team: response.team, name: response.name },
    true
  );
  res.redirect("indexx.html");
});

app.use(express.static(__dirname + '/public'));
//app.use(express.static(__dirname + '/public/imagens'));
//////////////////////// LOGIN //////////////////////////////////// 
var path = require("path");
app.use('/', express.static('app'));
app.get('*', function(req, res){

    if(logado){
        console.log(" LOGADO");
        if(req.path == '/logout'){
          req.logout();
          logado = false;
          res.sendFile(path.join(__dirname + '/public/login.html'));
        } else res.sendFile(path.join(__dirname + '/views/indexx.html'));
    }else{
      console.log("NÃO LOGADO");
      //res.redirect("login.html");
      console.log(__dirname + '/public/login.html')
      res.setHeader('Content-Type', 'text/html');
      res.sendFile(path.join(__dirname + '/public/login.html'));

    }

  });

app.post("/logar", urlencodedParser, function(req, res) {
  // Prepare output in JSON format
  
    user = req.body.user;
    password = req.body.password;
  

  if(user == USUARIO && password == SENHA){
    logado = true;
    res.sendFile(path.join(__dirname + '/views/indexx.html'));
  }else{
    res.sendFile(path.join(__dirname + '/public/login.html'));
  }

  
});
 
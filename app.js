const express = require("express");
const mariadb = require("mariadb");
const bodyParser = require("body-parser");



const app = express();
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));
app.set("view engine","ejs");

const pool = mariadb.createPool({
    host: 'localhost',
    user: 'root',
    password: 'Ayra@1234',
    database: 'exam',
    connectionLimit: 5,
});


app.get("/",function(req,res){
    res.render("login");
});


 

  
  app.listen(3993, () => {
    console.log('Server is running on port 3993');
  });
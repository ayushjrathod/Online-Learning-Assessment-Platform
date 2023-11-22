const express = require("express");
const mariadb = require("mariadb");

const app = express();

const pool = mariadb.createPool({
    host: 'localhost',
    user: 'root',
    password: 'Ayra@1234',
    database: 'exam',
    connectionLimit: 5,
});


app.get("/",function(req,res){
    res.send("helloo crew")
});
  
  // Define your routes and middleware here
  
  app.listen(3993, () => {
    console.log('Server is running on port 3993');
  });
const express = require("express");
const bodyParser = require("body-parser");
const fs = require('fs');
const path = require('path');
const session = require('express-session');
const mysql = require("mysql2");

const questionsFilePath = path.join("./data", 'questions.json');
const usersFilePath = path.join("./data", 'users.json');
let users = [];

const questions = JSON.parse(fs.readFileSync(questionsFilePath, 'utf-8'));

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({ secret: 'your-secret-key', resave: true, saveUninitialized: true }));
app.use(express.static("public"));
app.set("view engine", "ejs");

const connection = mysql.createConnection({
  host: "127.0.0.1",
  user: "root",
  password: "Ayra@1234",
  database: "online_learning",
});

connection.connect((err) => {
  if (err) {
    console.error("Error connecting to MySQL:", err);
    return;
  }
  console.log("Connected to MySQL");
});

const userCorrectAnswers = {};

app.get("/", (req, res) => {
  return res.redirect("login");
});

app.get('/login', (req, res) => {
  res.render('login');
});

app.get('/quiz', async (req, res) => {
  if (!req.session.user) {
    return res.redirect('/login');
  }

  try {
    const [questionsResult, fields] = await connection.promise().query('SELECT * FROM questions');
    const questions = questionsResult.map(question => {
      return {
        question_id: question.question_id,
        question_text: question.question_text,
        options: JSON.parse(question.options),
        correct_answer: question.correct_answer,
        question_type: question.question_type,
      };
    });

    res.render('quiz', { questions });
  } catch (error) {
    console.error('Error retrieving questions:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.post("/login", async (req, res) => {
  const email = req.body.email;
  const prn = req.body.prn;

  console.log(
    "Attempting login for user with Email ID:",
    email,
    "and PRN No:",
    prn
  );

  try {
    const [results, fields] = await connection.promise().query(
      "SELECT * FROM users WHERE email_id = ? AND prn_no = ?",
      [email, prn]
    );

    if (results.length > 0) {
      req.session.user = results[0];
      res.redirect("/quiz");
    } else {
      res.send("Invalid credentials. Please try again.");
    }
  } catch (error) {
    console.error("Error executing login query:", error);
    res.status(500).send("Internal Server Error");
  }
});

app.get('/results', async (req, res) => {
  if (!req.session.user) {
    return res.redirect('/login');
  }

  const user = req.session.user;
  const userId = user.user_id;

  try {
    const [result, fields] = await connection.promise().query('SELECT score FROM scores WHERE user_id = ?', [userId]);

    if (result.length > 0) {
      const userScore = result[0].score;
      res.render('results', { user, correctAnswers: [], userScore }); // You need to modify this part based on your actual logic
    } else {
      res.send('User score not found.');
    }
  } catch (error) {
    console.error('Error retrieving user score:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.listen(4444, () => {
  console.log('Server is running on port 4444');
});

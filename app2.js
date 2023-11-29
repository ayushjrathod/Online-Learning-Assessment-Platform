const express = require("express");
const mariadb = require("mysql");
const bodyParser = require("body-parser");
const fs = require('fs'); // Node.js File System module
const path = require('path');
const session = require('express-session');




// Path to the questions.json file
const questionsFilePath = path.join("./data", 'questions.json');
const usersFilePath = path.join("./data", 'users.json');

// Initialize users as an empty array if the file doesn't exist
//let users = [    { "id": 1, "username": "1234", "password": "password1" },
//{ "id": 2, "username": "4321", "password": "password2" } ];
let users = []

// Read questions from the JSON file
const questions = JSON.parse(fs.readFileSync(questionsFilePath, 'utf-8'));


const app = express();
app.use(bodyParser.urlencoded({extended:true}));
app.use(session({ secret: 'your-secret-key', resave: true, saveUninitialized: true }));
app.use(express.static("public"));
app.set("view engine","ejs");

const pool = mariadb.createPool({
    host: '127.0.0.1',
    user: 'root',
    password: 'Ayra@1234',
    database: 'online_learning',
    connectionLimit: 10,
});

const userCorrectAnswers = {};

app.get("/",(req,res)=>{
  return res.redirect("login");
})


app.get('/login', (req, res) => {
  res.render('login');
});

app.post('/login', async (req, res) => {
  const email = req.body.email;
  const prn = req.body.prn;

  console.log('Attempting login for user with Email ID:', email, 'and PRN No:', prn);
  let connection;

  try {
    connection = await pool.getConnection();
    const result = await connection.query('SELECT * FROM users WHERE email_id = ? AND prn_no = ?', [emailId, prnNo]);

    if (result.length > 0) {
      req.session.user = result[0];
      res.redirect('/quiz');
    } else {
      res.send('Invalid credentials. Please try again.');
    }
  } catch (error) {
    console.error('Error executing login query:', error);
    res.status(500).send('Internal Server Error');
  } finally {
    if (connection) connection.release();
  }
});

app.get('/quiz', async (req, res) => {
  if (!req.session.user) {
    return res.redirect('/login');
  }

  // Retrieve questions from the database
  let connection;

  try {
    connection = await pool.getConnection();
    const questions = await connection.query('SELECT * FROM questions');
    res.render('quiz', { questions });
  } catch (error) {
    console.error('Error retrieving questions:', error);
    res.status(500).send('Internal Server Error');
  } finally {
    if (connection) connection.release();
  }
});

app.post('/quiz', async (req, res) => {
  if (!req.session.user) {
    return res.redirect('/login');
  }

  const user = req.session.user;
  const userId = user.user_id;

  const userAnswers = req.body;

  // Compare user's answers with correct answers from the database
  let connection;

  try {
    connection = await pool.getConnection();
    const correctAnswers = await connection.query('SELECT correct_answer FROM questions');
    
    // Your logic to compare user's answers with correct answers

    // Store correct answers for the user
    userCorrectAnswers[userId] = correctAnswers;

    res.redirect('/results');
  } catch (error) {
    console.error('Error retrieving correct answers:', error);
    res.status(500).send('Internal Server Error');
  } finally {
    if (connection) connection.release();
  }
});

app.get('/results', async (req, res) => {
  if (!req.session.user) {
    return res.redirect('/login');
  }

  const user = req.session.user;
  const userId = user.user_id;

  const correctAnswers = userCorrectAnswers[userId] || [];

  // Retrieve user's score from the database
  let connection;

  try {
    connection = await pool.getConnection();
    const result = await connection.query('SELECT score FROM scores WHERE user_id = ?', [userId]);

    if (result.length > 0) {
      const userScore = result[0].score;
      res.render('results', { user, correctAnswers, userScore });
    } else {
      res.send('User score not found.');
    }
  } catch (error) {
    console.error('Error retrieving user score:', error);
    res.status(500).send('Internal Server Error');
  } finally {
    if (connection) connection.release();
  }
});

app.get('/quiz', async (req, res) => {
  try {
      const connection = await pool.getConnection();

      // Retrieve questions from the database
      const questionsResult = await connection.query('SELECT * FROM questions');
      const questions = questionsResult.map(question => {
          return {
              question_id: question.question_id,
              question_text: question.question_text,
              options: JSON.parse(question.options), // Parse the JSON array
              correct_answer: question.correct_answer,
              question_type: question.question_type,
          };
      });

      connection.release();

      res.render('quiz', { questions });
  } catch (error) {
      console.error('Error retrieving questions:', error);
      res.status(500).send('Internal Server Error');
  }
});

app.listen(4444, () => {
  console.log('Server is running on port 4444');
});
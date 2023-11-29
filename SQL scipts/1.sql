-- Create a new database
CREATE DATABASE IF NOT EXISTS online_learning;

-- Use the new database
USE online_learning;

-- Create the 'questions' table
CREATE TABLE IF NOT EXISTS questions (
    question_id INT AUTO_INCREMENT PRIMARY KEY,
    question_text VARCHAR(255) NOT NULL,
    options VARCHAR(255) NOT NULL,
    correct_answer VARCHAR(255) NOT NULL,
    question_type VARCHAR(50) NOT NULL
);

-- Create the 'users' table
CREATE TABLE IF NOT EXISTS users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    email_id VARCHAR(255) NOT NULL,
    roll_no VARCHAR(20) NOT NULL,
    prn_no VARCHAR(8) NOT NULL,
    name VARCHAR(255) NOT NULL
);

-- Create the 'scores' table
CREATE TABLE IF NOT EXISTS scores (
    score_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    score INT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

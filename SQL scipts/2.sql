-- Insert data into 'questions' table
INSERT INTO questions (question_text, options, correct_answer, question_type)
VALUES
  ('What is the capital of France?', '["Paris", "London", "Berlin", "Rome"]', 'Paris', 'multiple_choice'),
  ('Who wrote Romeo and Juliet?', '["William Shakespeare", "Jane Austen", "Charles Dickens", "Leo Tolstoy"]', 'William Shakespeare', 'multiple_choice'),
  ('What is the largest planet in our solar system?', '["Earth", "Jupiter", "Mars", "Venus"]', 'Jupiter', 'multiple_choice');

-- Insert data into 'users' table
INSERT INTO users (email_id, roll_no, prn_no, name)
VALUES
  ('user1@example.com', '12345', '12345678', 'John Doe'),
  ('user2@example.com', '54321', '87654321', 'Jane Doe');

-- Insert data into 'scores' table
INSERT INTO scores (user_id, score)
VALUES
  (1, 85),
  (2, 92);

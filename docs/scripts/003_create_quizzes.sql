-- Create quizzes table
CREATE TABLE IF NOT EXISTS quizzes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  difficulty TEXT CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')),
  category TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create quiz_questions table
CREATE TABLE IF NOT EXISTS quiz_questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quiz_id UUID REFERENCES quizzes(id) ON DELETE CASCADE,
  question TEXT NOT NULL,
  options JSONB NOT NULL,
  correct_answer TEXT NOT NULL,
  explanation TEXT,
  order_index INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create quiz_attempts table
CREATE TABLE IF NOT EXISTS quiz_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  quiz_id UUID REFERENCES quizzes(id) ON DELETE CASCADE,
  score INTEGER NOT NULL,
  total_questions INTEGER NOT NULL,
  completed_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE quizzes ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_attempts ENABLE ROW LEVEL SECURITY;

-- Policies for quizzes (public read)
CREATE POLICY "Anyone can view quizzes" ON quizzes FOR SELECT USING (true);

-- Policies for quiz_questions (public read)
CREATE POLICY "Anyone can view quiz questions" ON quiz_questions FOR SELECT USING (true);

-- Policies for quiz_attempts (users can only see their own)
CREATE POLICY "Users can view own attempts" ON quiz_attempts FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own attempts" ON quiz_attempts FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Insert sample quizzes
INSERT INTO quizzes (title, description, difficulty, category) VALUES
('Solar System Basics', 'Test your knowledge of our solar system', 'beginner', 'planets'),
('Planetary Properties', 'Learn about the physical characteristics of planets', 'intermediate', 'planets'),
('Advanced Astronomy', 'Challenge yourself with advanced astronomical concepts', 'advanced', 'general');

-- Get quiz IDs for inserting questions
DO $$
DECLARE
  basics_quiz_id UUID;
  properties_quiz_id UUID;
  advanced_quiz_id UUID;
BEGIN
  SELECT id INTO basics_quiz_id FROM quizzes WHERE title = 'Solar System Basics';
  SELECT id INTO properties_quiz_id FROM quizzes WHERE title = 'Planetary Properties';
  SELECT id INTO advanced_quiz_id FROM quizzes WHERE title = 'Advanced Astronomy';

  -- Solar System Basics questions
  INSERT INTO quiz_questions (quiz_id, question, options, correct_answer, explanation, order_index) VALUES
  (basics_quiz_id, 'How many planets are in our solar system?', '["6", "7", "8", "9"]', '8', 'There are 8 planets in our solar system since Pluto was reclassified as a dwarf planet in 2006.', 1),
  (basics_quiz_id, 'Which planet is closest to the Sun?', '["Venus", "Mercury", "Earth", "Mars"]', 'Mercury', 'Mercury is the closest planet to the Sun, orbiting at an average distance of about 58 million kilometers.', 2),
  (basics_quiz_id, 'Which planet is known as the Red Planet?', '["Venus", "Mars", "Jupiter", "Saturn"]', 'Mars', 'Mars appears red due to iron oxide (rust) on its surface.', 3),
  (basics_quiz_id, 'What is the largest planet in our solar system?', '["Saturn", "Neptune", "Jupiter", "Uranus"]', 'Jupiter', 'Jupiter is the largest planet, with a mass more than twice that of all other planets combined.', 4),
  (basics_quiz_id, 'Which planet has the most moons?', '["Jupiter", "Saturn", "Uranus", "Neptune"]', 'Saturn', 'Saturn has over 80 confirmed moons, making it the planet with the most known moons.', 5);

  -- Planetary Properties questions
  INSERT INTO quiz_questions (quiz_id, question, options, correct_answer, explanation, order_index) VALUES
  (properties_quiz_id, 'Which planet has the shortest day?', '["Mercury", "Venus", "Jupiter", "Saturn"]', 'Jupiter', 'Jupiter rotates once every 10 hours, giving it the shortest day of any planet.', 1),
  (properties_quiz_id, 'Which planet has the longest year?', '["Uranus", "Neptune", "Saturn", "Jupiter"]', 'Neptune', 'Neptune takes about 165 Earth years to complete one orbit around the Sun.', 2),
  (properties_quiz_id, 'Which planet is the hottest?', '["Mercury", "Venus", "Mars", "Jupiter"]', 'Venus', 'Venus is the hottest planet due to its thick atmosphere creating a runaway greenhouse effect, with temperatures around 462°C.', 3),
  (properties_quiz_id, 'Which planet has the most prominent ring system?', '["Jupiter", "Saturn", "Uranus", "Neptune"]', 'Saturn', 'Saturn has the most extensive and visible ring system, made primarily of ice particles.', 4),
  (properties_quiz_id, 'Which planet rotates on its side?', '["Mars", "Jupiter", "Uranus", "Neptune"]', 'Uranus', 'Uranus has an axial tilt of about 98 degrees, meaning it essentially rotates on its side.', 5);

  -- Advanced Astronomy questions
  INSERT INTO quiz_questions (quiz_id, question, options, correct_answer, explanation, order_index) VALUES
  (advanced_quiz_id, 'What is the approximate age of our solar system?', '["3.5 billion years", "4.6 billion years", "5.8 billion years", "7.2 billion years"]', '4.6 billion years', 'Our solar system formed approximately 4.6 billion years ago from a giant molecular cloud.', 1),
  (advanced_quiz_id, 'What percentage of the solar system''s mass is in the Sun?', '["75%", "85%", "95%", "99.8%"]', '99.8%', 'The Sun contains about 99.8% of the total mass of the solar system.', 2),
  (advanced_quiz_id, 'What is the Kuiper Belt?', '["A region of asteroids", "A region of comets and dwarf planets", "A type of nebula", "A galaxy cluster"]', 'A region of comets and dwarf planets', 'The Kuiper Belt is a region beyond Neptune containing many small icy bodies and dwarf planets like Pluto.', 3),
  (advanced_quiz_id, 'What causes the auroras on Earth?', '["Volcanic activity", "Solar wind particles", "Meteor showers", "Cosmic rays"]', 'Solar wind particles', 'Auroras are caused by charged particles from the solar wind interacting with Earth''s magnetic field and atmosphere.', 4),
  (advanced_quiz_id, 'What is a light-year?', '["A unit of time", "A unit of distance", "A unit of speed", "A unit of energy"]', 'A unit of distance', 'A light-year is the distance light travels in one year, approximately 9.46 trillion kilometers.', 5);
END $$;

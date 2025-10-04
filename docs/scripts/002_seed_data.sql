-- Seed some initial celestial objects
INSERT INTO celestial_objects (name, type, description, mass, radius, distance_from_sun, orbital_period, rotation_period, temperature, atmosphere, discovery_date, discovered_by, thumbnail_url) VALUES
-- Sun
('Sun', 'star', 'The star at the center of our Solar System', 1.989e30, 696340, 0, 0, 609.12, 5778, 'Hydrogen, Helium', NULL, 'Ancient', '/placeholder.svg?height=200&width=200'),

-- Planets
('Mercury', 'planet', 'The smallest planet in our Solar System and closest to the Sun', 3.285e23, 2439.7, 57.9e6, 88, 1407.6, 440, 'Trace atmosphere', NULL, 'Ancient', '/placeholder.svg?height=200&width=200'),
('Venus', 'planet', 'The second planet from the Sun, known for its thick toxic atmosphere', 4.867e24, 6051.8, 108.2e6, 225, 5832.5, 737, 'Carbon dioxide, Nitrogen', NULL, 'Ancient', '/placeholder.svg?height=200&width=200'),
('Earth', 'planet', 'Our home planet, the only known planet to harbor life', 5.972e24, 6371, 149.6e6, 365.25, 24, 288, 'Nitrogen, Oxygen', NULL, 'Ancient', '/placeholder.svg?height=200&width=200'),
('Mars', 'planet', 'The Red Planet, fourth from the Sun', 6.39e23, 3389.5, 227.9e6, 687, 24.6, 210, 'Carbon dioxide, Nitrogen, Argon', NULL, 'Ancient', '/placeholder.svg?height=200&width=200'),
('Jupiter', 'planet', 'The largest planet in our Solar System, a gas giant', 1.898e27, 69911, 778.5e6, 4333, 9.9, 165, 'Hydrogen, Helium', NULL, 'Ancient', '/placeholder.svg?height=200&width=200'),
('Saturn', 'planet', 'Known for its prominent ring system', 5.683e26, 58232, 1434e6, 10759, 10.7, 134, 'Hydrogen, Helium', NULL, 'Ancient', '/placeholder.svg?height=200&width=200'),
('Uranus', 'planet', 'An ice giant with a unique sideways rotation', 8.681e25, 25362, 2871e6, 30687, 17.2, 76, 'Hydrogen, Helium, Methane', '1781-03-13', 'William Herschel', '/placeholder.svg?height=200&width=200'),
('Neptune', 'planet', 'The farthest planet from the Sun, another ice giant', 1.024e26, 24622, 4495e6, 60190, 16.1, 72, 'Hydrogen, Helium, Methane', '1846-09-23', 'Johann Galle', '/placeholder.svg?height=200&width=200');

-- Get Earth's ID for moons
DO $$
DECLARE
  earth_id UUID;
  jupiter_id UUID;
  saturn_id UUID;
  mars_id UUID;
BEGIN
  SELECT id INTO earth_id FROM celestial_objects WHERE name = 'Earth';
  SELECT id INTO jupiter_id FROM celestial_objects WHERE name = 'Jupiter';
  SELECT id INTO saturn_id FROM celestial_objects WHERE name = 'Saturn';
  SELECT id INTO mars_id FROM celestial_objects WHERE name = 'Mars';

  -- Earth's Moon
  INSERT INTO celestial_objects (name, type, description, mass, radius, orbital_period, rotation_period, temperature, parent_object_id, thumbnail_url) VALUES
  ('Moon', 'moon', 'Earth''s only natural satellite', 7.342e22, 1737.4, 27.3, 27.3, 220, earth_id, '/placeholder.svg?height=200&width=200');

  -- Jupiter's Moons
  INSERT INTO celestial_objects (name, type, description, mass, radius, orbital_period, parent_object_id, discovered_by, discovery_date, thumbnail_url) VALUES
  ('Io', 'moon', 'The most volcanically active body in the Solar System', 8.93e22, 1821.6, 1.77, jupiter_id, 'Galileo Galilei', '1610-01-08', '/placeholder.svg?height=200&width=200'),
  ('Europa', 'moon', 'An icy moon with a subsurface ocean', 4.8e22, 1560.8, 3.55, jupiter_id, 'Galileo Galilei', '1610-01-08', '/placeholder.svg?height=200&width=200'),
  ('Ganymede', 'moon', 'The largest moon in the Solar System', 1.48e23, 2634.1, 7.15, jupiter_id, 'Galileo Galilei', '1610-01-08', '/placeholder.svg?height=200&width=200'),
  ('Callisto', 'moon', 'A heavily cratered moon of Jupiter', 1.08e23, 2410.3, 16.69, jupiter_id, 'Galileo Galilei', '1610-01-08', '/placeholder.svg?height=200&width=200');

  -- Saturn's Moons
  INSERT INTO celestial_objects (name, type, description, mass, radius, orbital_period, parent_object_id, discovered_by, discovery_date, thumbnail_url) VALUES
  ('Titan', 'moon', 'Saturn''s largest moon with a thick atmosphere', 1.35e23, 2574.7, 15.95, saturn_id, 'Christiaan Huygens', '1655-03-25', '/placeholder.svg?height=200&width=200'),
  ('Enceladus', 'moon', 'An icy moon with geysers erupting from its surface', 1.08e20, 252.1, 1.37, saturn_id, 'William Herschel', '1789-08-28', '/placeholder.svg?height=200&width=200');

  -- Mars' Moons
  INSERT INTO celestial_objects (name, type, description, radius, orbital_period, parent_object_id, discovered_by, discovery_date, thumbnail_url) VALUES
  ('Phobos', 'moon', 'The larger and closer of Mars'' two moons', 11.27, 0.32, mars_id, 'Asaph Hall', '1877-08-18', '/placeholder.svg?height=200&width=200'),
  ('Deimos', 'moon', 'The smaller and more distant of Mars'' two moons', 6.2, 1.26, mars_id, 'Asaph Hall', '1877-08-12', '/placeholder.svg?height=200&width=200');
END $$;

-- Seed some quiz questions
DO $$
DECLARE
  earth_id UUID;
  mars_id UUID;
  jupiter_id UUID;
BEGIN
  SELECT id INTO earth_id FROM celestial_objects WHERE name = 'Earth';
  SELECT id INTO mars_id FROM celestial_objects WHERE name = 'Mars';
  SELECT id INTO jupiter_id FROM celestial_objects WHERE name = 'Jupiter';

  INSERT INTO quiz_questions (object_id, question, options, correct_answer, difficulty) VALUES
  (earth_id, 'What percentage of Earth''s surface is covered by water?', '["50%", "60%", "71%", "80%"]', '71%', 'easy'),
  (earth_id, 'How old is Earth approximately?', '["2.5 billion years", "3.5 billion years", "4.5 billion years", "5.5 billion years"]', '4.5 billion years', 'medium'),
  (mars_id, 'Why is Mars called the Red Planet?', '["It has red clouds", "Iron oxide on its surface", "Red vegetation", "Reflection from the sun"]', 'Iron oxide on its surface', 'easy'),
  (mars_id, 'How many moons does Mars have?', '["0", "1", "2", "4"]', '2', 'easy'),
  (jupiter_id, 'What is the Great Red Spot on Jupiter?', '["A volcano", "A giant storm", "A crater", "An ocean"]', 'A giant storm', 'medium'),
  (jupiter_id, 'How many known moons does Jupiter have?', '["67", "79", "95", "Over 90"]', 'Over 90', 'hard');
END $$;

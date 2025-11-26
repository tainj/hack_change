-- Drop in reverse order
DROP TABLE IF EXISTS submissions;
DROP TABLE IF EXISTS assignments;
DROP TABLE IF EXISTS courses;
DROP TABLE IF EXISTS users;

-- Optionally remove extension
DROP EXTENSION IF EXISTS pgcrypto;

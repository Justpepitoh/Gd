const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

const dbPath = path.join(__dirname, 'geometry_dash.db');
const db = new sqlite3.Database(dbPath);

db.serialize(() => {
  // Table Utilisateurs
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT DEFAULT 'player'
  )`);

  // Table Niveaux
  db.run(`CREATE TABLE IF NOT EXISTS levels (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    creator TEXT NOT NULL,
    position INTEGER UNIQUE NOT NULL,
    video_url TEXT
  )`);

  // Table Runs
  db.run(`CREATE TABLE IF NOT EXISTS runs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    level_id INTEGER,
    status TEXT DEFAULT 'pending',
    video_url TEXT NOT NULL,
    FOREIGN KEY(user_id) REFERENCES users(id),
    FOREIGN KEY(level_id) REFERENCES levels(id)
  )`);

  console.log("Base de données initialisée avec succès !");
});

db.close();
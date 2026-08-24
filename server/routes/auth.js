const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, '../database/geometry_dash.db');
const db = new sqlite3.Database(dbPath);
const SECRET_KEY = 'mon_secret_super_securise';

// Inscription
router.post('/register', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ error: 'Remplis tous les champs' });

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    db.run(`INSERT INTO users (username, password) VALUES (?, ?)`, [username, hashedPassword], function(err) {
      if (err) return res.status(400).json({ error: 'Pseudo déjà utilisé' });
      res.json({ message: 'Compte créé avec succès !' });
    });
  } catch (err) {
    res.status(500).json({ error: 'Erreur lors du hachage du mot de passe' });
  }
});

// Connexion
router.post('/login', (req, res) => {
  const { username, password } = req.body;
  
  db.get(`SELECT * FROM users WHERE username = ?`, [username], async (err, user) => {
    if (err || !user) return res.status(400).json({ error: 'Utilisateur introuvable' });
    
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) return res.status(400).json({ error: 'Mot de passe incorrect' });

    const token = jwt.sign({ id: user.id, username: user.username, role: user.role }, SECRET_KEY);
    res.json({ token, username: user.username, role: user.role });
  });
});

module.exports = router;
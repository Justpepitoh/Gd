const express = require('express');
const router = express.Router();
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, '../database/geometry_dash.db');
const db = new sqlite3.Database(dbPath);

// Récupérer les niveaux
router.get('/', (req, res) => {
  db.all(`SELECT * FROM levels ORDER BY position ASC`, [], (err, rows) => {
    if (err) return res.status(500).json({ error: 'Erreur serveur' });
    res.json(rows);
  });
});

// Ajouter un niveau
router.post('/add', (req, res) => {
  const { name, creator, position, video_url } = req.body;
  if (!name || !creator || !position) {
    return res.status(400).json({ error: 'Champs manquants' });
  }

  db.run(
    `INSERT INTO levels (name, creator, position, video_url) VALUES (?, ?, ?, ?)`,
    [name, creator, position, video_url || ''],
    function(err) {
      if (err) return res.status(400).json({ error: 'Position déjà prise ou erreur' });
      res.json({ message: 'Niveau ajouté à la liste !' });
    }
  );
});

module.exports = router;
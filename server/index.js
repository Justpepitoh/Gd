const express = require('express');
const path = require('path');
const authRoutes = require('./routes/auth');
const levelRoutes = require('./routes/levels');

const app = express();
// Render définit automatiquement process.env.PORT
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, '../client/public')));

// Ajout des routes
app.use('/api/auth', authRoutes);
app.use('/api/levels', levelRoutes);

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/public/index.html'));
});

app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
});
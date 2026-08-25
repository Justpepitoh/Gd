const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(express.json());
app.use(cors()); // Permet à ton frontend de communiquer avec ton backend

// Sert les fichiers statiques situés dans Client/public
app.use(express.static(path.join(__dirname, '../Client/public')));

const dataFile = path.join(__dirname, 'data.json');

// Fonction pour lire les données
function readData() {
    if (!fs.existsSync(dataFile)) {
        return { levels: [], players: [], logs: ["[SYSTEM] Serveur initialisé."] };
    }
    return JSON.parse(fs.readFileSync(dataFile, 'utf8'));
}

// Fonction pour sauvegarder les données
function saveData(data) {
    fs.writeFileSync(dataFile, JSON.stringify(data, null, 2));
}

// --- ROUTES DU SITE & DE L'API ---

// Route pour afficher la page principale (index.html)
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../Client/public/index.html'));
});

// 1. Récupérer toutes les données (accessible à tous)
app.get('/api/data', (req, res) => {
    res.json(readData());
});

// 2. Vérification du mot de passe admin
app.post('/api/auth/login', (req, res) => {
    const vraiMotDePasse = process.env.ADMIN_PASSWORD || "AdminTest123!"; 
    
    if (req.body.password === vraiMotDePasse) {
        res.json({ success: true, token: "mon-token-super-secret" });
    } else {
        res.status(401).json({ success: false });
    }
});

// Middleware pour vérifier si c'est l'admin
function verifyAdmin(req, res, next) {
    if (req.headers.authorization === "Bearer mon-token-secret" || req.headers.authorization === "mon-token-super-secret") {
        next();
    } else {
        res.status(403).json({ error: "Accès refusé" });
    }
}

// 3. Sauvegarder les modifications (accessible QUE aux admins)
app.post('/api/save', verifyAdmin, (req, res) => {
    const newData = req.body;
    saveData(newData);
    res.json({ success: true, message: "Données sauvegardées avec succès !" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Serveur démarré sur le port ${PORT}`);
});
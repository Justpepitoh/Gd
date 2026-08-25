const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(express.json());
app.use(cors());

// Sert les fichiers statiques de ton dossier client/public
app.use(express.static(path.join(__dirname, '../client/public')));

const dataFile = path.join(__dirname, 'data.json');

function readData() {
    if (!fs.existsSync(dataFile)) {
        return { levels: [], players: [], logs: ["[SYSTEM] Serveur initialisé."] };
    }
    return JSON.parse(fs.readFileSync(dataFile, 'utf8'));
}

function saveData(data) {
    fs.writeFileSync(dataFile, JSON.stringify(data, null, 2));
}

// --- API ---

app.get('/api/data', (req, res) => {
    res.json(readData());
});

app.post('/api/auth/login', (req, res) => {
    const vraiMotDePasse = process.env.ADMIN_PASSWORD || "AdminTest123!"; 
    if (req.body.password === vraiMotDePasse) {
        res.json({ success: true, token: "mon-token-super-secret" });
    } else {
        res.status(401).json({ success: false });
    }
});

function verifyAdmin(req, res, next) {
    if (req.headers.authorization === "Bearer mon-token-super-secret" || req.headers.authorization === "mon-token-super-secret") {
        next();
    } else {
        res.status(403).json({ error: "Accès refusé" });
    }
}

app.post('/api/save', verifyAdmin, (req, res) => {
    saveData(req.body);
    res.json({ success: true, message: "Données sauvegardées !" });
});

// Renvoie index.html pour n'importe quelle autre route
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/public/index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Serveur démarré sur le port ${PORT}`);
});
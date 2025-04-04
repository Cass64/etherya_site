const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const bodyParser = require('body-parser');
const app = express();

// Connexion à MongoDB (modifie l'URL pour correspondre à ta base de données)
mongoose.connect('mongodb://localhost:27017/etherya', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log("MongoDB connecté"))
.catch((err) => console.log(err));

// Middleware pour parser le corps de la requête
app.use(bodyParser.json());

// Modèle utilisateur MongoDB
const User = mongoose.model('User', new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true }
}));

// Route de connexion
app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        // Recherche l'utilisateur dans la base de données
        const user = await User.findOne({ username });

        if (!user) {
            return res.json({ success: false, message: 'Utilisateur non trouvé' });
        }

        // Comparer le mot de passe hashé avec celui fourni
        const isMatch = await bcrypt.compare(password, user.password);

        if (isMatch) {
            return res.json({ success: true });
        } else {
            return res.json({ success: false, message: 'Mot de passe incorrect' });
        }
    } catch (err) {
        console.log(err);
        return res.status(500).json({ success: false, message: 'Erreur serveur' });
    }
});

// Lancer le serveur
app.listen(3000, () => {
    console.log('Serveur démarré sur le port 3000');
});

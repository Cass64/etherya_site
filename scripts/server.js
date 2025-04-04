require('dotenv').config();  // Charge les variables d'environnement depuis un fichier .env

const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const app = express();
const port = process.env.PORT || 3000;

// Middleware pour parser les requêtes JSON
app.use(express.json());

// Connexion à MongoDB en utilisant l'URI stockée dans les variables d'environnement
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connecté à MongoDB"))
  .catch((error) => console.error("Erreur de connexion MongoDB : ", error));
    process.exit(1);  // Arrêter le serveur en cas de problème de connexion
  });

// Exemple de schéma utilisateur pour valider la connexion
const userSchema = new mongoose.Schema({
  username: String,
  password: String
}, { collection: 'loggin_site' });

const User = mongoose.model('User', userSchema);

// Route pour valider la connexion
app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ success: false, message: "Utilisateur introuvable" });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ success: false, message: "Mot de passe incorrect" });
    }

    res.json({ success: true, message: "Connexion réussie" });
  } catch (err) {
    console.error("Erreur lors de la tentative de connexion : ", err);
    res.status(500).json({ success: false, message: "Erreur du serveur" });
  }
});

// Lancer le serveur
app.listen(port, () => {
  console.log(`Serveur en écoute sur le port ${port}`);
});

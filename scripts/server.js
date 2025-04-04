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

// Exemple de schéma utilisateur pour valider la connexion
const userSchema = new mongoose.Schema({
  username: String,
  password: String
},{ collection: 'loggin_site' });

const User = mongoose.model('User', userSchema);

// Route pour valider la connexion
app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  const user = await User.findOne({ username });
  if (!user) {
    return res.status(401).send("Utilisateur introuvable");
  }

  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    return res.status(401).send("Mot de passe incorrect");
  }

  res.send("Connexion réussie");
});

// Lancer le serveur
app.listen(port, () => {
  console.log(`Serveur en écoute sur le port ${port}`);
});

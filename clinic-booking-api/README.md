# 🏥 Guide Complet - Clinic Booking API

## 📋 ÉTAPE 1 : Prérequis

### ✅ Vérifier les installations requises :

```bash
# Vérifier Node.js (version 16+ recommandée)
node --version

# Vérifier npm
npm --version

# Vérifier MySQL
mysql --version
```

Si manquants :
- **Node.js** : [Télécharger ici](https://nodejs.org)
- **MySQL** : [Télécharger ici](https://dev.mysql.com/downloads/mysql/)

---

## 🗄️ ÉTAPE 2 : Configuration MySQL

### 2.1 Démarrer MySQL

**Windows :**
```cmd
# Démarrer le service MySQL
net start mysql80

# Ou via Services Windows (services.msc)
```

**macOS :**
```bash
# Via Homebrew
brew services start mysql

# Ou via System Preferences > MySQL
```

**Linux (Ubuntu/Debian) :**
```bash
# Démarrer MySQL
sudo systemctl start mysql
sudo systemctl enable mysql

# Vérifier le statut
sudo systemctl status mysql
```

### 2.2 Se connecter à MySQL

```bash
# Se connecter (remplacez 'root' par votre utilisateur)
mysql -u root -p

# Entrez votre mot de passe MySQL
```

### 2.3 Créer la base de données

```sql
-- Dans le terminal MySQL
CREATE DATABASE clinic_booking_system;

-- Vérifier la création
SHOW DATABASES;

-- Utiliser la base
USE clinic_booking_system;

-- Quitter MySQL
EXIT;
```

### 2.4 Importer le schéma

```bash
# Depuis votre terminal (pas MySQL)
mysql -u root -p clinic_booking_system < clinic_database.sql

# Ou copier-coller le code SQL depuis notre artifact dans MySQL Workbench
```

---

## 📁 ÉTAPE 3 : Créer la Structure du Projet

### 3.1 Créer le projet

```bash
# Créer le dossier principal
mkdir clinic-booking-api
cd clinic-booking-api

# Créer la structure de dossiers
mkdir -p src/{config,controllers,models,routes,middleware,services,utils}
mkdir -p tests/{unit,integration}

# Créer les fichiers principaux
touch server.js .env .gitignore README.md

# Créer les fichiers de configuration
touch src/config/database.js src/config/environment.js

# Créer les fichiers de base (pour commencer)
touch src/controllers/patientController.js
touch src/routes/patientRoutes.js
```

### 3.2 Initialiser le projet Node.js

```bash
# Initialiser package.json
npm init -y

# Installer les dépendances principales
npm install express mysql2 dotenv cors helmet express-validator morgan

# Installer les dépendances de développement
npm install --save-dev nodemon
```

---

## ⚙️ ÉTAPE 4 : Configuration des Fichiers

### 4.1 Créer le fichier .env

```bash
# .env
NODE_ENV=development
PORT=3000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=votre_mot_de_passe_mysql
DB_NAME=clinic_booking_system
```

### 4.2 Configurer package.json

Ajoutez ces scripts dans `package.json` :

```json
{
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js",
    "test": "echo \"Error: no test specified\" && exit 1"
  }
}
```

### 4.3 Créer src/config/environment.js

```javascript
const dotenv = require('dotenv');
dotenv.config();

const config = {
    nodeEnv: process.env.NODE_ENV || 'development',
    server: {
        port: parseInt(process.env.PORT) || 3000,
        host: process.env.HOST || 'localhost'
    },
    database: {
        host: process.env.DB_HOST,
        port: parseInt(process.env.DB_PORT) || 3306,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD || '',
        name: process.env.DB_NAME
    }
};

if (config.nodeEnv === 'development') {
    console.log('🔧 Configuration:', {
        environment: config.nodeEnv,
        server: `${config.server.host}:${config.server.port}`,
        database: `${config.database.user}@${config.database.host}/${config.database.name}`
    });
}

module.exports = config;
```

### 4.4 Créer src/config/database.js

```javascript
const mysql = require('mysql2/promise');
const config = require('./environment');

const pool = mysql.createPool({
    host: config.database.host,
    user: config.database.user,
    password: config.database.password,
    database: config.database.name,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

class Database {
    constructor() {
        this.pool = pool;
    }

    async query(sql, params = []) {
        try {
            const [rows] = await this.pool.execute(sql, params);
            return rows;
        } catch (error) {
            console.error('❌ Database Error:', error.message);
            throw error;
        }
    }

    async testConnection() {
        try {
            const connection = await this.pool.getConnection();
            await connection.ping();
            connection.release();
            console.log('✅ Database connected successfully');
            return true;
        } catch (error) {
            console.error('❌ Database connection failed:', error.message);
            return false;
        }
    }
}

const db = new Database();
module.exports = db;
```

### 4.5 Créer server.js

```javascript
const express = require('express');
const cors = require('cors');
const config = require('./src/config/environment');
const db = require('./src/config/database');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Test de la base de données au démarrage
db.testConnection();

// Route de base
app.get('/', (req, res) => {
    res.json({
        message: 'Clinic Booking API is running!',
        version: '1.0.0',
        endpoints: [
            'GET /api/patients',
            'POST /api/patients',
            'GET /api/appointments',
            'POST /api/appointments'
        ]
    });
});

// Route de test pour les patients
app.get('/api/patients', async (req, res) => {
    try {
        const patients = await db.query('SELECT * FROM patients LIMIT 10');
        res.json({
            success: true,
            data: patients,
            count: patients.length
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la récupération des patients',
            error: error.message
        });
    }
});

// Route de test pour créer un patient
app.post('/api/patients', async (req, res) => {
    try {
        const { first_name, last_name, email, phone, date_of_birth, gender } = req.body;

        const result = await db.query(
            'INSERT INTO patients (first_name, last_name, email, phone, date_of_birth, gender) VALUES (?, ?, ?, ?, ?, ?)',
            [first_name, last_name, email, phone, date_of_birth, gender]
        );

        res.status(201).json({
            success: true,
            message: 'Patient créé avec succès',
            data: {
                id: result.insertId,
                ...req.body
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la création du patient',
            error: error.message
        });
    }
});

// Middleware de gestion d'erreur
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        message: 'Erreur interne du serveur'
    });
});

// Démarrage du serveur
const PORT = config.server.port;
app.listen(PORT, () => {
    console.log('');
    console.log('🏥 ================================');
    console.log('   CLINIC BOOKING API STARTED');
    console.log('🏥 ================================');
    console.log(`🚀 Server: http://localhost:${PORT}`);
    console.log(`📡 API: http://localhost:${PORT}/api`);
    console.log(`📊 Health: http://localhost:${PORT}/`);
    console.log('================================');
    console.log('');
});
```

---

## 🚀 ÉTAPE 5 : Démarrage et Tests

### 5.1 Vérifier que MySQL fonctionne

```bash
# Test rapide de connexion
mysql -u root -p -e "USE clinic_booking_system; SELECT COUNT(*) FROM patients;"
```

### 5.2 Démarrer l'API

```bash
# Mode développement (avec auto-restart)
npm run dev

# Ou mode normal
npm start
```

Vous devriez voir :
```
🏥 ================================
   CLINIC BOOKING API STARTED
🏥 ================================
🚀 Server: http://localhost:3000
📡 API: http://localhost:3000/api
📊 Health: http://localhost:3000/
================================
✅ Database connected successfully
```

### 5.3 Tester l'API

**Test 1 - Santé du serveur :**
```bash
curl http://localhost:3000/
```

**Test 2 - Liste des patients :**
```bash
curl http://localhost:3000/api/patients
```

**Test 3 - Créer un patient :**
```bash
curl -X POST http://localhost:3000/api/patients \
  -H "Content-Type: application/json" \
  -d '{
    "first_name": "Jean",
    "last_name": "Dupont",
    "email": "jean.dupont@email.com",
    "phone": "+33-1-23-45-67-89",
    "date_of_birth": "1985-06-15",
    "gender": "Male"
  }'
```

---

## 🛠️ ÉTAPE 6 : Résolution des Problèmes

### Erreur "Cannot connect to database"
```bash
# Vérifier que MySQL est démarré
sudo systemctl status mysql  # Linux
brew services list | grep mysql  # macOS

# Vérifier les credentials
mysql -u root -p clinic_booking_system
```

### Erreur "Port 3000 already in use"
```bash
# Trouver le processus qui utilise le port
lsof -i :3000  # Mac/Linux
netstat -ano | findstr :3000  # Windows

# Tuer le processus
kill -9 PID_NUMBER

# Ou changer le port dans .env
PORT=3001
```

### Erreur "Module not found"
```bash
# Réinstaller les dépendances
rm -rf node_modules package-lock.json
npm install
```

---

## ✅ ÉTAPE 7 : Validation

Votre API fonctionne correctement si :

1. ✅ MySQL est démarré et accessible
2. ✅ La base `clinic_booking_system` existe
3. ✅ Le serveur Node.js démarre sans erreur
4. ✅ `curl http://localhost:3000/` retourne du JSON
5. ✅ `curl http://localhost:3000/api/patients` retourne la liste des patients
6. ✅ Vous pouvez créer un patient via POST

**🎉 Félicitations ! Votre API Clinic Booking est opérationnelle !**
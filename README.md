# JobConnect

Plateforme web de mise en relation entre candidats et recruteurs. JobConnect permet de publier des offres, déposer un CV, postuler avec une lettre de motivation, calculer un score de compatibilité grâce à un modèle local et suivre la décision du recruteur avec des notifications.

## Fonctionnalités

- Inscription et connexion des candidats, recruteurs et administrateurs.
- Gestion du profil candidat et dépôt de CV PDF/DOC/DOCX.
- Création et gestion d'offres d'emploi par les recruteurs.
- Recherche et consultation des offres par les candidats.
- Dépôt d'une candidature avec lettre de motivation facultative.
- Calcul du score CV/offre par le service ML.
- Consultation des candidatures côté recruteur avec les coordonnées du candidat, son CV et sa lettre de motivation.
- Acceptation ou refus d'une candidature.
- Notification du candidat après la décision du recruteur.
- Administration des candidats, recruteurs, offres et statistiques.

## Architecture

```text
Job-Connect-main/
├── backend/       API Node.js / Express et MongoDB
├── frontend/      Interface React / Vite / Tailwind CSS
├── ml-service/    API FastAPI pour les embeddings et le matching CV/offre
├── model/         Modèle Sentence-Transformers local
└── backend/uploads/   CV, lettres de motivation et logos
```

## Technologies utilisées

- **Frontend :** React 18, React Router, Vite, Tailwind CSS et Axios.
- **Backend :** Node.js, Express 5 et Mongoose pour exposer l'API REST et accéder à MongoDB.
- **Authentification et fichiers :** JSON Web Token (JWT), bcrypt, Multer et Nodemailer pour les emails facultatifs.
- **Service de matching :** Python, FastAPI, Sentence-Transformers, NumPy et PyMuPDF pour extraire le texte des CV PDF et le comparer aux offres.
- **Modèle IA :** modèle Sentence-Transformers stocké localement dans `model/`; le score compare les embeddings normalisés du CV et de l'offre.
- **Base de données :** MongoDB, avec des modèles définis à l'aide de Mongoose.

### Services et ports

| Service | Adresse | Technologie |
| --- | --- | --- |
| Frontend | http://localhost:5173 | React + Vite |
| Backend | http://localhost:5000 | Node.js + Express |
| Service ML | http://localhost:8000 | FastAPI + Sentence-Transformers |
| Base de données | `mongodb://127.0.0.1:27017/jobconnect` | MongoDB |

## Prérequis

- Node.js 18 ou version plus récente.
- Python 3.10 ou version compatible avec les dépendances ML.
- MongoDB local ou une instance MongoDB accessible.
- Git, si le projet est cloné depuis un dépôt.

## Installation

Depuis la racine du projet :

```powershell
Copy-Item .env.example .env
```

Modifiez ensuite `.env` selon votre environnement. Installez les dépendances dans chaque partie du projet :

```powershell
cd backend
npm install

cd ..\frontend
npm install

cd ..\ml-service
python -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install -r requirements.txt
```

Si PowerShell bloque `npm.ps1`, utilisez `npm.cmd` à la place de `npm`.

## Configuration `.env`

Le fichier `.env` doit se trouver à la racine du projet :

```env
MONGO_URI=mongodb://127.0.0.1:27017/jobconnect
JWT_SECRET=change_this_development_secret
PORT=5000
ML_SERVICE=http://localhost:8000

# Facultatif : réinitialisation du mot de passe par email
EMAIL_USER=
EMAIL_PASS=
FRONTEND_URL=http://localhost:5173

# Facultatif : compte administrateur initial
ADMIN_NOM=Super
ADMIN_PRENOM=Admin
ADMIN_EMAIL=admin@gmail.com
ADMIN_TEL=12345678
ADMIN_PASSWORD=admin123
```

En production, utilisez un `JWT_SECRET` long et aléatoire et ne committez jamais le fichier `.env`.

## Lancement en développement

Lancez les trois services dans trois terminaux séparés.

### 1. Service ML

```powershell
cd ml-service
.\.venv\Scripts\Activate.ps1
python -m uvicorn app:app --host 0.0.0.0 --port 8000 --reload
```

Le modèle est chargé par défaut depuis :

```text
model/cv_job_matcher_model-20260202T131242Z-3-001/cv_job_matcher_model
```

Pour utiliser un autre modèle :

```powershell
$env:MODEL_PATH = 'C:\chemin\vers\cv_job_matcher_model'
```

### 2. Backend

```powershell
cd backend
npm run dev
```

Ou sans Nodemon :

```powershell
npm start
```

### 3. Frontend

```powershell
cd frontend
npm run dev
```

Ouvrez ensuite http://localhost:5173.

## Vérification du service ML

```powershell
Invoke-RestMethod http://localhost:8000/health
```

Endpoints ML disponibles :

- `GET /health`
- `POST /embed`
- `POST /embed_file`
- `POST /score_match`

## API principale

Toutes les routes protégées utilisent l'en-tête suivant :

```http
Authorization: Bearer <token>
```

### Authentification

- `POST /api/candidat/login`
- `POST /api/recruteur/login`
- `POST /api/admin/login`
- `POST /api/candidat/register`
- `POST /api/recruteur/register`
- `POST /api/auth/forgot-password`
- `POST /api/auth/reset-password`

### Offres

- `GET /api/offres`
- `GET /api/offres/filtrer/valides`
- `POST /api/offres/add` recruteur
- `PUT /api/offres/update/:id` recruteur
- `DELETE /api/offres/delete/:id` recruteur

### Candidatures

- `POST /api/candidatures` candidat
- `GET /api/candidatures/candidat/:id_candidat` candidat
- `GET /api/candidatures/recruteur/offres` recruteur
- `PATCH /api/candidatures/:id/etat` recruteur, avec `{ "etat": "accepte" }` ou `{ "etat": "refuse" }`
- `GET /api/candidatures/notifications/candidat/:id_candidat` candidat
- `DELETE /api/candidatures/:id` utilisateur autorisé

Lorsqu'une candidature est acceptée ou refusée, une notification est enregistrée dans MongoDB et devient visible dans l'espace candidat.

## Fichiers uploadés

Les fichiers sont enregistrés dans `backend/uploads/` :

- `backend/uploads/cv/` pour les CV ;
- `backend/uploads/lettres_motivation/` pour les lettres ;
- `backend/uploads/logos/` pour les logos d'entreprise.

Les fichiers sont servis par le backend sous l'URL `http://localhost:5000/uploads/...`.

## Scripts utiles

### Backend

```powershell
npm run dev
npm start
```

### Frontend

```powershell
npm run dev
npm run build
npm run preview
```

### ML

```powershell
python -m pip install -r requirements.txt
python -m uvicorn app:app --reload
```

## Dépannage

### `ModuleNotFoundError: No module named 'pymupdf'`

Activez l'environnement virtuel du service ML puis installez les dépendances :

```powershell
cd ml-service
.\.venv\Scripts\Activate.ps1
python -m pip install -r requirements.txt
```

### `MONGO_URI est manquante`

Vérifiez que `.env` existe à la racine du projet et contient `MONGO_URI`.

### Le backend ne calcule pas le score

Vérifiez que le service ML est démarré sur le port 8000 et que `ML_SERVICE=http://localhost:8000` est configuré dans `.env`.

### Le CV ou la lettre ne s'ouvre pas

Vérifiez que le backend est démarré depuis le dossier `backend` et que les fichiers existent dans `backend/uploads/`.

## État du projet

Le projet est configuré pour un usage local en développement. Avant un déploiement, il est recommandé d'ajouter une validation stricte des rôles sur toutes les routes, une gestion centralisée des URLs d'API, une politique de stockage des fichiers et des tests automatisés backend/frontend.

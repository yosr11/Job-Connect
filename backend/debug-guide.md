# Guide de débogage - Projet MERN

## 🚀 Instructions de test

### 1. Démarrer les serveurs

**Backend :**
```bash
cd backend
npm run dev
```

**Frontend :**
```bash
cd frontend
npm run dev
```

### 2. Tester les endpoints directement

**Test des entreprises :**
```bash
# Récupérer toutes les entreprises
curl http://localhost:5000/api/entreprises

# Créer une entreprise
curl -X POST http://localhost:5000/api/entreprises \
  -H "Content-Type: application/json" \
  -d '{
    "nom": "Test Company",
    "secteur": "Technologie",
    "adresse": "123 Test Street",
    "site_web": "https://test.com",
    "description": "Une entreprise de test"
  }'
```

**Test de l'inscription recruteur :**
```bash
curl -X POST http://localhost:5000/api/recruteur/register \
  -H "Content-Type: application/json" \
  -d '{
    "nom": "Dupont",
    "prenom": "Jean",
    "email": "jean.dupont@test.com",
    "num_tel": "12345678",
    "mot_de_passe": "password123",
    "confirmer_mot_de_passe": "password123",
    "entreprise_id": "ID_DE_L_ENTREPRISE"
  }'
```

## 🔍 Points de débogage

### Console Backend
Vérifiez que vous voyez ces messages :
- `✅ Entreprises récupérées: X entreprises`
- `✅ Entreprise créée avec succès: [objet entreprise]`
- `✅ Recruteur créé avec succès: email@example.com`

### Console Frontend (F12)
Vérifiez que vous voyez ces messages :
- `🔄 Chargement des entreprises...`
- `📡 Réponse API entreprises: [objet réponse]`
- `✅ Entreprises chargées: X`
- `🔄 Création de l'entreprise: [objet formulaire]`
- `📡 Réponse API création entreprise: [objet réponse]`
- `✅ Nouvelle entreprise créée: [objet entreprise]`

## 🐛 Problèmes courants et solutions

### 1. "Entreprises non chargées"
- Vérifiez que le backend est démarré sur le port 5000
- Vérifiez la console pour les erreurs CORS
- Vérifiez que MongoDB est connecté

### 2. "Erreur lors de la création d'entreprise"
- Vérifiez que le nom de l'entreprise n'existe pas déjà
- Vérifiez que tous les champs requis sont remplis
- Vérifiez la console backend pour les erreurs de validation

### 3. "Erreur lors de l'inscription recruteur"
- Vérifiez qu'une entreprise est sélectionnée
- Vérifiez que l'entreprise_id est valide
- Vérifiez que l'email n'existe pas déjà

## 📊 Structure des réponses attendues

### GET /api/entreprises
```json
{
  "success": true,
  "message": "Entreprises récupérées avec succès",
  "entreprises": [
    {
      "id": "ObjectId",
      "_id": "ObjectId",
      "nom": "Nom de l'entreprise",
      "adresse": "Adresse",
      "secteur": "Secteur",
      "site_web": "Site web",
      "description": "Description",
      "date_creation": "Date"
    }
  ]
}
```

### POST /api/entreprises
```json
{
  "success": true,
  "message": "Entreprise créée avec succès",
  "entreprise": {
    "id": "ObjectId",
    "_id": "ObjectId",
    "nom": "Nom de l'entreprise",
    "adresse": "Adresse",
    "secteur": "Secteur",
    "site_web": "Site web",
    "description": "Description",
    "date_creation": "Date"
  }
}
```

### POST /api/recruteur/register
```json
{
  "success": true,
  "message": "Compte créé avec succès",
  "token": "JWT_TOKEN",
  "user": {
    "id": "ObjectId",
    "nom": "Nom",
    "prenom": "Prénom",
    "email": "email@example.com",
    "role": "recruteur",
    "entreprise": {
      "id": "ObjectId",
      "nom": "Nom de l'entreprise"
    }
  }
}
```


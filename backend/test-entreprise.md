# Test de l'entité Entreprise et inscription Recruteur

## Instructions de test

1. **Démarrer le backend :**
   ```bash
   cd backend
   npm run dev
   ```

2. **Démarrer le frontend :**
   ```bash
   cd frontend
   npm run dev
   ```

3. **Tester les endpoints entreprises :**
   - `GET http://localhost:5000/api/entreprises` - Récupérer toutes les entreprises
   - `POST http://localhost:5000/api/entreprises` - Créer une nouvelle entreprise

4. **Tester l'inscription recruteur :**
   - Aller sur http://localhost:5173/register-recruteur
   - Sélectionner une entreprise existante OU créer une nouvelle entreprise
   - Remplir le formulaire avec des données valides
   - Vérifier que l'inscription réussit

## Points de vérification

### Backend
- ✅ Le modèle Entreprise est créé avec tous les champs requis
- ✅ Le contrôleur entrepriseController gère toutes les opérations CRUD
- ✅ Les routes entreprises sont configurées et accessibles
- ✅ Le modèle Recruteur inclut la relation avec Entreprise
- ✅ Le contrôleur recruteur gère la relation entreprise
- ✅ Le hashage des mots de passe fonctionne avec bcrypt
- ✅ Les validations sont en place

### Frontend
- ✅ Le formulaire charge la liste des entreprises existantes
- ✅ Le dropdown permet de sélectionner une entreprise
- ✅ Le bouton "Créer une entreprise" déploie le formulaire
- ✅ La création d'entreprise fonctionne et sélectionne automatiquement
- ✅ L'inscription du recruteur inclut l'ID de l'entreprise
- ✅ Les messages d'erreur et de succès s'affichent correctement

## Endpoints testés

- `GET /api/entreprises` - Liste des entreprises
- `POST /api/entreprises` - Création d'entreprise
- `GET /api/entreprises/:id` - Détails d'une entreprise
- `PUT /api/entreprises/:id` - Mise à jour d'entreprise
- `DELETE /api/entreprises/:id` - Suppression d'entreprise
- `POST /api/recruteur/register` - Inscription recruteur avec entreprise
- `POST /api/recruteur/login` - Connexion recruteur

## Structure de données

### Entreprise
```json
{
  "nom": "string (requis, unique)",
  "adresse": "string (optionnel)",
  "secteur": "string (optionnel)",
  "site_web": "string (optionnel, format URL)",
  "description": "string (optionnel)",
  "date_creation": "Date (auto)"
}
```

### Recruteur (avec relation)
```json
{
  "nom": "string (requis)",
  "prenom": "string (requis)",
  "email": "string (requis, unique)",
  "num_tel": "string (requis, 8 chiffres)",
  "mot_de_passe": "string (requis, hashé)",
  "confirmer_mot_de_passe": "string (requis, hashé)",
  "entreprise": "ObjectId (requis, référence vers Entreprise)"
}
```


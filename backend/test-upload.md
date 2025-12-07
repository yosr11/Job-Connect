# Test de l'upload de CV

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

3. **Tester l'inscription :**
   - Aller sur http://localhost:5173/register-candidat
   - Remplir le formulaire avec des données valides
   - Uploader un fichier CV (PDF, DOC, ou DOCX)
   - Vérifier que l'inscription réussit

## Points de vérification

- ✅ Le fichier CV est bien uploadé dans `backend/uploads/`
- ✅ Le chemin du fichier est sauvegardé dans MongoDB
- ✅ Les validations fonctionnent (email, téléphone, mots de passe)
- ✅ Les messages d'erreur et de succès s'affichent correctement
- ✅ Le hashage des mots de passe fonctionne
- ✅ Le login fonctionne avec les mots de passe hashés

## Endpoints testés

- `POST /api/candidat/register` - Inscription avec upload de CV
- `POST /api/candidat/login` - Connexion avec mots de passe hashés

# Test de l'affichage des messages - Frontend React

## 🎯 Objectif
Vérifier que les messages de succès et d'erreur s'affichent correctement dans les formulaires d'inscription.

## 🧪 Scénarios de test

### 1. Test RegisterRecruteur.jsx

#### Test 1.1: Inscription réussie
1. Aller sur `http://localhost:5173/register-recruteur`
2. Remplir tous les champs obligatoires
3. Sélectionner ou créer une entreprise
4. Cliquer sur "Créer mon compte"
5. ✅ **Résultat attendu** : 
   - Message vert "Compte créé avec succès"
   - Formulaire se réinitialise
   - Message disparaît après 5 secondes

#### Test 1.2: Erreur de validation
1. Laisser des champs obligatoires vides
2. Cliquer sur "Créer mon compte"
3. ✅ **Résultat attendu** : 
   - Message rouge avec l'erreur de validation
   - Message disparaît quand on commence à taper

#### Test 1.3: Erreur serveur
1. Utiliser un email déjà existant
2. Cliquer sur "Créer mon compte"
3. ✅ **Résultat attendu** : 
   - Message rouge "Un compte avec cet email existe déjà"

#### Test 1.4: Création d'entreprise
1. Cliquer sur "Créer une nouvelle entreprise"
2. Remplir le formulaire d'entreprise
3. Cliquer sur "Créer l'entreprise"
4. ✅ **Résultat attendu** : 
   - Message vert "Entreprise créée et sélectionnée avec succès !"
   - Entreprise ajoutée au dropdown
   - Entreprise sélectionnée automatiquement

### 2. Test RegisterCandidat.jsx

#### Test 2.1: Inscription réussie
1. Aller sur `http://localhost:5173/register-candidat`
2. Remplir tous les champs obligatoires
3. Optionnellement uploader un CV
4. Cliquer sur "Créer mon compte"
5. ✅ **Résultat attendu** : 
   - Message vert "Compte créé avec succès"
   - Formulaire se réinitialise
   - Message disparaît après 5 secondes

#### Test 2.2: Erreur de validation
1. Laisser des champs obligatoires vides
2. Cliquer sur "Créer mon compte"
3. ✅ **Résultat attendu** : 
   - Message rouge avec l'erreur de validation
   - Message disparaît quand on commence à taper

#### Test 2.3: Erreur serveur
1. Utiliser un email déjà existant
2. Cliquer sur "Créer mon compte"
3. ✅ **Résultat attendu** : 
   - Message rouge "Un compte avec cet email existe déjà"

## 🔍 Vérifications dans la console

### Console Backend
Vérifiez ces messages :
```
✅ Entreprise créée avec succès: [objet entreprise]
✅ Recruteur créé avec succès: email@example.com
✅ Candidat créé avec succès: email@example.com
```

### Console Frontend
Vérifiez ces messages :
```
🔄 Inscription du recruteur: [objet formulaire]
📡 Réponse API inscription recruteur: [objet réponse]
✅ Recruteur inscrit avec succès

🔄 Inscription du candidat: [objet formulaire]
📎 Fichier CV ajouté: [nom du fichier]
📡 Réponse API inscription candidat: [objet réponse]
✅ Candidat inscrit avec succès
```

## 🎨 Interface utilisateur

### Messages de succès
- ✅ **Couleur** : Vert (bg-green-50, text-green-700, border-green-200)
- ✅ **Icône** : CheckCircle
- ✅ **Position** : Au-dessus du bouton de soumission
- ✅ **Durée** : Disparaît automatiquement après 5 secondes

### Messages d'erreur
- ✅ **Couleur** : Rouge (bg-red-50, text-red-700, border-red-200)
- ✅ **Icône** : AlertCircle
- ✅ **Position** : Au-dessus du bouton de soumission
- ✅ **Durée** : Disparaît quand l'utilisateur commence à taper

## 🐛 Problèmes courants et solutions

### 1. "Aucun message ne s'affiche"
- Vérifier que les états `message` et `error` sont bien définis
- Vérifier que les conditions d'affichage sont correctes
- Vérifier la console pour les erreurs JavaScript

### 2. "Messages qui ne disparaissent pas"
- Vérifier que les fonctions `setTimeout` sont bien configurées
- Vérifier que les fonctions `onChange` effacent les messages

### 3. "Messages d'erreur incorrects"
- Vérifier que les réponses du backend sont bien formatées
- Vérifier que la gestion des erreurs axios est correcte

## 📊 Structure des réponses attendues

### Succès
```json
{
  "success": true,
  "message": "Compte créé avec succès",
  "token": "JWT_TOKEN",
  "user": { ... }
}
```

### Erreur
```json
{
  "success": false,
  "message": "Un compte avec cet email existe déjà"
}
```

## 🚀 Instructions de test

1. **Démarrer les serveurs**
   ```bash
   # Backend
   cd backend
   npm run dev
   
   # Frontend
   cd frontend
   npm run dev
   ```

2. **Ouvrir la console** (F12) pour voir les logs

3. **Tester chaque scénario** ci-dessus

4. **Vérifier** que les messages s'affichent correctement

5. **Vérifier** que les messages disparaissent au bon moment


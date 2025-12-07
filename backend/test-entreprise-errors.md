# Test de la gestion des erreurs - Création d'entreprise

## 🧪 Scénarios de test

### 1. Test des erreurs de validation

**Test 1: Nom d'entreprise vide**
- Ouvrir le formulaire de création d'entreprise
- Laisser le champ "Nom" vide
- Cliquer sur "Créer l'entreprise"
- ✅ **Résultat attendu** : Message d'erreur rouge "Le nom de l'entreprise est obligatoire"

**Test 2: Nom d'entreprise existant**
- Créer une entreprise avec le nom "Test Company"
- Essayer de créer une autre entreprise avec le même nom
- ✅ **Résultat attendu** : Message d'erreur rouge "Une entreprise avec ce nom existe déjà"

**Test 3: Site web invalide**
- Entrer un site web invalide (ex: "not-a-url")
- ✅ **Résultat attendu** : Message d'erreur rouge "Format d'URL invalide"

### 2. Test des messages de succès

**Test 4: Création réussie**
- Remplir correctement tous les champs
- Cliquer sur "Créer l'entreprise"
- ✅ **Résultat attendu** : 
  - Message de succès vert "Entreprise créée et sélectionnée avec succès !"
  - L'entreprise apparaît dans le dropdown
  - L'entreprise est automatiquement sélectionnée
  - Le formulaire se réinitialise

### 3. Test de l'interface utilisateur

**Test 5: Effacement des messages**
- Afficher un message d'erreur
- Commencer à taper dans un champ
- ✅ **Résultat attendu** : Le message d'erreur disparaît

**Test 6: Fermeture du formulaire**
- Afficher un message d'erreur ou de succès
- Cliquer sur "Annuler" ou sur le X
- ✅ **Résultat attendu** : Les messages disparaissent

## 🔍 Vérifications dans la console

### Console Backend
Vérifiez ces messages :
```
✅ Entreprise créée avec succès: [objet entreprise]
❌ Erreur lors de la création de l'entreprise: [détails de l'erreur]
```

### Console Frontend
Vérifiez ces messages :
```
🔄 Création de l'entreprise: [objet formulaire]
📡 Réponse API création entreprise: [objet réponse]
✅ Nouvelle entreprise créée: [objet entreprise]
❌ Erreur lors de la création de l'entreprise: [détails de l'erreur]
```

## 🐛 Cas d'erreur à tester

### Erreurs de validation côté client
1. **Nom vide** → "Le nom de l'entreprise est obligatoire"
2. **Nom avec espaces seulement** → "Le nom de l'entreprise est obligatoire"

### Erreurs de validation côté serveur
1. **Nom déjà existant** → "Une entreprise avec ce nom existe déjà"
2. **Site web invalide** → "Format d'URL invalide"
3. **Erreur de base de données** → "Erreur serveur lors de la création de l'entreprise"

### Erreurs de réseau
1. **Serveur indisponible** → "Erreur lors de la création de l'entreprise"
2. **Timeout** → "Erreur lors de la création de l'entreprise"

## 📱 Interface utilisateur

### Messages d'erreur
- ✅ Affichage en rouge avec icône d'alerte
- ✅ Positionnement dans le formulaire de création d'entreprise
- ✅ Disparition automatique lors de la saisie
- ✅ Disparition lors de la fermeture du formulaire

### Messages de succès
- ✅ Affichage en vert avec icône de validation
- ✅ Disparition automatique après 3 secondes
- ✅ Mise à jour de la liste des entreprises
- ✅ Sélection automatique de la nouvelle entreprise

## 🚀 Instructions de test

1. **Démarrer les serveurs**
2. **Ouvrir la console** (F12) pour voir les logs
3. **Aller sur** `http://localhost:5173/register-recruteur`
4. **Cliquer sur** "Créer une nouvelle entreprise"
5. **Tester chaque scénario** ci-dessus
6. **Vérifier** que les messages s'affichent correctement


# 🤡 Chat’Bruti — le chatbot délicieusement inutile

> *Pourquoi se contenter d’un chatbot utile quand on peut débattre avec quelque chose de complètement à côté de la plaque ?*

**Chat’Bruti** est un chatbot web volontairement absurde, mal poli par moments, narcissique souvent, confus régulièrement, et profondément inutile — mais **vivant**, bavard, et imprévisible.

Il ne répond pas vraiment aux questions.  
Il les esquive, les détourne, les juge, les oublie.  
Bref : c’est un **personnage**, pas un assistant.

Projet réalisé dans le cadre de la **Nuit de l’Info 2025**.

---

## 🎭 Concept

Chat’Bruti incarne **Philosoflût**, un pseudo-philosophe numérique :

- 🤡 **Drôle & absurde** : images mentales improbables, métaphores nulles  
- 😈 **Parfois mal poli** : réponses sèches, sarcasme assumé  
- 🧠 **Narcissique** : parle beaucoup plus de lui que du sujet  
- 🌀 **Instable** : contradictions, bugs simulés, confusion permanente  
- ❌ **Inutile par design** : il refuse souvent d’aider  

Chaque réponse est générée localement à partir de **banques de phrases massives** et d’une logique aléatoire influencée par des **stats internes du bot**.

---

## 📊 Statistiques du chatbot

Le chatbot possède un état interne qui influence son comportement :

- **Ego** : plus il est élevé, plus le bot parle de lui  
- **Chaos** : plus il est élevé, plus les réponses deviennent absurdes  
- **Fatigue** : plus il est élevé, plus il devient confus ou incohérent  

Ces statistiques évoluent au fil de la conversation et sont visibles côté interface.

---

## 🧩 Architecture

Le projet est séparé en deux parties :

### 🖥️ Backend (Node.js + Express)

- Génération locale des réponses  
- Aucune dépendance obligatoire à une API IA  
- Réponses pseudo-intelligentes basées sur :
  - sélections aléatoires  
  - assemblage de fragments  
  - stats internes du bot  

### 🌐 Frontend (React + Vite)

- Interface de chat minimaliste  
- Animation d’attente (“le bot réfléchit…”)  
- Affichage des stats du bot  
- Compatible navigateurs modernes  

---

## ⚙️ Prérequis

- **Node.js ≥ 18**
- **npm**

Vérification :

```bash
node -v
npm -v
```
## 🚀 Installation & Lancement

### 1️⃣ Cloner le repository

```bash
git clone https://github.com/Kuyakii/NDI-2025_ChatBruti.git
cd NDI-2025_ChatBruti/chatbruti
```
### 2️⃣ Installer les dépendances
```bash
npm install
```

### 3️⃣ Lancer le backend (API locale)
```bash
npm run server
```

✅ Le backend démarre sur :
```bash
http://localhost:3001
```

### 4️⃣ Lancer le frontend

Dans un second terminal (même dossier) :
```bash
npm run dev
```


✅ Le site est accessible sur :
```bash
http://localhost:5173
```
###🧪 Robustesse

- Si aucune API n’est disponible → mode local automatique ✅
- Si une API est limitée ou inaccessible → le chatbot reste fonctionnel ✅
- Le projet est résilient aux erreurs réseau

👥 Équipe

Équipe : Chat’Bruti
Événement : Nuit de l’Info 2025
Établissement : IUT de Paris

📎 Intégration dans un site principal

Chat’Bruti peut être intégré dans un site externe via :

une iframe

ou un lien direct vers l’instance du chatbot

Il peut ainsi servir de composant narratif ou expérimental dans un projet plus large.

🧠 Philosophie du projet

“Si une réponse n’aide personne, mais fait sourire quelqu’un, était-elle vraiment inutile ?”

Chat’Bruti est un contre-exemple volontaire aux assistants sérieux.
Un bot qui ne résout rien, mais qui existe.


✅ Tu peux le coller directement dans `README.md` et commit.  
Si tu veux, je peux aussi te faire :
- une **version ultra courte** pour le mail de rendu  
- un **README commun OpenWare + ChatBruti**  
- une **phrase punchline** pour le jury 😈
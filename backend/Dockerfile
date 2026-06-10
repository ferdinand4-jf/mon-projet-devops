# 1. Utilisation d'une image de base Node.js légère (version alpine)
FROM node:24.16.0-alpine

# 2. Définition du répertoire de travail à l'intérieur du conteneur
WORKDIR /app

# 3. Copie des fichiers de gestion des dépendances
COPY package*.json ./

# 4. Installation des dépendances de production
RUN npm install --only=production

# 5. Copie de tout le reste du code source du backend
COPY . .

# 6. Exposition du port interne du backend
EXPOSE 5000

# 7. Commande par défaut pour exécuter le serveur
CMD ["npm", "start"]
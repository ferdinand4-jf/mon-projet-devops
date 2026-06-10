# Étape 1 : Build de l'application Next.js
FROM node:24.16.0-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Étape 2 : Exécution de l'application en mode production
FROM node:24.16.0-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

# On copie uniquement ce qui est nécessaire depuis l'étape de build
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/node_modules ./node_modules

EXPOSE 3000
CMD ["npm", "start"]
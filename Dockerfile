# Étape 1 : Build de l'application React
FROM node:18 AS builder
WORKDIR /App/SUAS
COPY package.json package-lock.json ./
RUN npm install --legacy-peer-deps
COPY . .
RUN npm run build

# Étape 2 : Serveur Node.js minimal
FROM node:18
WORKDIR /App/SUAS
RUN npm install -g serve
COPY --from=builder /App/SUAS/dist .
EXPOSE 3000
CMD ["serve", "-s", ".", "--listen", "tcp://0.0.0.0:3000"]

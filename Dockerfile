# Étape 1 : Build de l'application React
FROM node:18 AS builder
WORKDIR /App/SUAS
COPY package.json package-lock.json ./
RUN npm install --legacy-peer-deps
COPY . .
RUN npm run build

# Étape 2 : Serveur Node.js minimal

#FROM node:18
#WORKDIR /App/SUAS
#RUN npm install -g serve
#COPY --from=builder /App/SUAS/dist .
#EXPOSE 3000

#CMD ["serve", "-s", ".", "--listen", "tcp://0.0.0.0:3000"]
#CMD ["node", "./src/App.jsx"]

# Stage 2: Serve the app with Nginx
FROM nginx:alpine
COPY --from=builder /App/SUAS/dist /usr/share/nginx/html
COPY nginx-conf/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

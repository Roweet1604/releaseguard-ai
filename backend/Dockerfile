FROM mcr.microsoft.com/playwright:v1.63.0-noble

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

WORKDIR /app/backend
RUN npm install

WORKDIR /app

EXPOSE 5000
EXPOSE 3001

CMD ["sh", "-c", "node demo-app/server.js & node backend/server.js"]
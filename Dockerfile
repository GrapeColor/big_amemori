FROM node:14

WORKDIR /app/big_amemori

COPY package*.json ./
RUN npm ci

COPY . .

CMD [ "node", "src/index.js" ]

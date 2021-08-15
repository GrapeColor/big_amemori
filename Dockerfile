FROM node:14

WORKDIR /app/big_amemori

COPY package*.json ./
RUN [ "npm", "ci", "--production" ]

COPY . .

CMD [ "node", "src/index.js" ]

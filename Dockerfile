FROM node:14

WORKDIR /discord_bot/big_amemori

COPY package*.json ./
RUN npm i

COPY . .

CMD [ "npm", "start" ]

FROM node:22.12.0-alpine

WORKDIR /app

COPY ./package*.json .

RUN npm install

COPY . .

RUN npm run build

RUN npm install --omit=dev

EXPOSE 3000

USER node

ENTRYPOINT ["npm", "start"]
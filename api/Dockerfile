FROM node:16.8 AS build

WORKDIR /usr/api

COPY . .

RUN npm install

RUN npm run build

FROM node:16.8

WORKDIR /usr/api

COPY --from=build /usr/api/package-lock.json ./

COPY package.json ./

COPY --from=build /usr/api/dist ./src

RUN npm ci

EXPOSE 8000

RUN ls ./src

CMD ["node", "./src/app.js"]
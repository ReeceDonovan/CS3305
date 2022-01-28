FROM node:16.8 AS build

WORKDIR /usr/api

COPY . .

RUN yarn

RUN yarn build

FROM node:16.8

WORKDIR /usr/api

COPY --from=build /usr/api/yarn.lock ./

COPY package.json ./

COPY --from=build /usr/api/dist ./src

RUN yarn install --production --ignore-scripts --prefer-offline

EXPOSE 8000

CMD ["node", "./src/app.js"]
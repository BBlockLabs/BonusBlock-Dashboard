FROM node:hydrogen-bullseye AS builder

WORKDIR /usr/src/app

COPY package*.json ./
#RUN npm config set registry https://nexus.internal.altermail.live/repository/npm-proxy/
RUN npm install --force

COPY .eslint*.js ./
COPY babel*.js ./
COPY no-prod*.js ./
COPY vue*.js ./
COPY src ./src
COPY public ./public

FROM builder AS build-development
COPY .env.kubernetes_dev ./.env
ENV NODE_OPTIONS=--openssl-legacy-provider
RUN npm run buildDev

FROM nginx:1.21.6 AS package-development

WORKDIR /app

COPY ./nginx/default.conf /etc/nginx/conf.d/
COPY --from=build-development /usr/src/app/dist /app/

EXPOSE 8080
ENTRYPOINT ["nginx", "-g", "daemon off;"]

FROM builder AS build-staging
COPY .env.kubernetes_staging ./.env
ENV NODE_OPTIONS=--openssl-legacy-provider
RUN npm run build

FROM nginx:1.21.6 AS package-staging

WORKDIR /app

COPY ./nginx/default.conf /etc/nginx/conf.d/
COPY --from=build-staging /usr/src/app/dist /app/

EXPOSE 8080
ENTRYPOINT ["nginx", "-g", "daemon off;"]

FROM builder AS build-production
COPY .env.kubernetes ./.env
ENV NODE_OPTIONS=--openssl-legacy-provider
RUN npm run buildStaging

FROM nginx:1.21.6 AS package-production

WORKDIR /app

COPY ./nginx/default.conf /etc/nginx/conf.d/
COPY --from=build-production /usr/src/app/dist /app/

EXPOSE 8080
ENTRYPOINT ["nginx", "-g", "daemon off;"]


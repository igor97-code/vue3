FROM node:16.14.2 as build-stage

WORKDIR /app

COPY ./ /app/

RUN npm install yarn && yarn install && yarn build


FROM nginx
COPY --from=build-stage /app/dist /usr/share/nginx/html
COPY  ./nginx/nginx.conf /etc/nginx/conf.d/default.conf

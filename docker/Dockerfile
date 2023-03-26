FROM node:16.14.0 AS build
WORKDIR /usr/src/app
COPY package.json package-lock.json ./
RUN npm install
COPY . .
RUN npm run ng build --prod

FROM nginx:1.23.3
COPY ./docker/nginx/nginx.conf /etc/nginx/nginx.conf
COPY ./docker/bootstrap.sh /etc/bootstrap.sh
COPY --from=build /usr/src/app/dist/SimpleTodoNg /usr/share/nginx/html

RUN ["chmod", "+x", "/usr/share/nginx/html/assets/config.sh"]
RUN ["chmod", "+x", "/etc/bootstrap.sh"]
ENTRYPOINT ["/etc/bootstrap.sh"]
CMD ["nginx", "-g", "daemon off;"]

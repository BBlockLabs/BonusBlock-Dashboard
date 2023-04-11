FROM nginx:1.21.6

WORKDIR /app

COPY ./nginx/default.conf /etc/nginx/conf.d/
COPY ./maintenance_page/* /app/

EXPOSE 8080
ENTRYPOINT ["nginx", "-g", "daemon off;"]

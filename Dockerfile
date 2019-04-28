FROM node:8.15.1 as builder

LABEL name="CloudFlow" \
      version="0.6.3" \
      description="A workflow visualization tool for OpenStack Mistral" \
      maintainers="Vitalii Solodilov <mcdkr@yandex.ru>"

RUN apt-get update && apt-get install -y apt-transport-https apt-utils

COPY package.json yarn.lock /build/
WORKDIR /build
RUN yarn install

COPY src src
COPY angular.json karma.conf.js package.json protractor.conf.js \
     proxy.conf.json tsconfig.json tslint.json ./
RUN npm run build

FROM nginx:1.14-alpine

ENV CF_CONFIG_DIR=/etc/nginx/conf.d \
    CF_SSL_DIR=/etc/nginx/ssl \
    CF_PORT=8000 \
    CF_SERVER_NAME=localhost \ 
    CF_MISTRAL_URL=http://127.0.0.1:8989 \
    CF_SSL=

COPY --from=builder "/build/dist" /opt/CloudFlow/dist
COPY scripts/cloudflow.docker.nginx.conf "${CF_CONFIG_DIR}/cloudflow.template"
RUN chown nginx:root -R \
    /var/log/nginx \
    /var/cache/nginx && \
    chmod g+w \
    /var/log/nginx \
    /var/cache/nginx \
    /var/run

CMD [[ "${CF_SSL}" = 'ssl' ]] && \ 
    export CF_SSL_CRT='ssl_certificate /etc/nginx/ssl/nginx.crt;' ; \
    export CF_SSL_KEY='ssl_certificate_key /etc/nginx/ssl/nginx.key;' || \
    echo 'SSL is disabled' && \
    envsubst '$$CF_CONFIG_DIR $$CF_PORT $$CF_SERVER_NAME $$CF_MISTRAL_URL \
    $$CF_SSL $$CF_SSL_CRT $$CF_SSL_KEY' \
    < "${CF_CONFIG_DIR}/cloudflow.template" > \
    "${CF_CONFIG_DIR}/default.conf" && \
    cat "${CF_CONFIG_DIR}/default.conf" \
    && exec nginx -g 'daemon off;'

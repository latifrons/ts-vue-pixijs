FROM node:10 as builder
RUN mkdir /app
WORKDIR /app
COPY package* /app/
RUN npm install

COPY . /app/
RUN npm run build

FROM nginx:stable-alpine
COPY --from=builder /app/build/* /usr/share/nginx/html/
EXPOSE 80
RUN echo "Asia/shanghai" > /etc/timezone
CMD ["nginx","-g","daemon off;"]


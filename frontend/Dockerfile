# frontend/Dockerfile
FROM node:18 AS build
WORKDIR /app

COPY package*.json ./
RUN ls -la  # ← добавь эту строку для отладки

RUN npm install
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
COPY nginx.prod.conf /etc/nginx/nginx.conf
EXPOSE 80
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 CMD wget -qO- http://localhost/ || exit 1
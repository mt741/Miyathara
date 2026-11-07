# ---- dev: Vite dev server with hot reload ----
FROM node:22-alpine AS dev
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 5173
CMD ["npm", "run", "dev"]

# ---- build: static production bundle ----
FROM dev AS build
RUN npm run build

# ---- prod: nginx serves the bundle ----
FROM nginx:1.27-alpine AS prod
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80

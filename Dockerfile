# Stage 1: Build the React App
FROM node:16-alpine as build
WORKDIR /app
COPY package.json ./
COPY package-lock.json ./ 

RUN npm install --legacy-peer-deps

COPY . .
RUN npm run build

# Stage 2: Serve with Nginx
FROM nginx:stable-alpine
COPY --from=build /app/build /usr/share/nginx/html
COPY nginx/default.conf /etc/nginx/conf.d/default.conf
# Grant Read/Execute permissions to everyone for the web folder
RUN chmod -R 755 /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
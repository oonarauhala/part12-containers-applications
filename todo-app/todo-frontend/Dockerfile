FROM node:16 as build-stage
ENV REACT_APP_BACKEND_URL=http://localhost:3000/
WORKDIR /usr/src/app
COPY . .
RUN npm ci
RUN npm run build
RUN CI=true npm test

FROM nginx:1.20-alpine
COPY --from=build-stage /usr/src/app/build /usr/share/nginx/html
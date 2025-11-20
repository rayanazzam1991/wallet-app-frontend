# =========================
# Stage 1: Build Vue app
# =========================
FROM node:22-alpine as build-stage
WORKDIR /app

RUN corepack enable
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile
COPY . .

# Define build argument for GraphQL endpoint with default value
ARG VITE_API_BASE_URL=http://localhost:8000/api
ARG VITE_BASE_URL=http://localhost:8000/
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL
ENV VITE_BASE_URL=$VITE_BASE_URL

# Debug: Print the value (remove in production)
RUN echo "Building with Base URL: VITE_BASE_URL"

RUN pnpm build-only

# =========================
# Stage 2: Production with nginx
# =========================
FROM nginx:stable-alpine as production-stage

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build-stage /app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

# ============================================================
# Dockerfile — Frontend React (pidelibre)
# ============================================================
# Multi-stage build:
#   Stage 1 (build): Node 20 Alpine → yarn build
#   Stage 2 (prod):  Alpine mínimo  → copia build al volumen
# ============================================================

# ── Stage 1: Build ──────────────────────────────────────────
FROM node:20-alpine AS build

WORKDIR /app

# Copiar archivos de dependencias primero (caché de Docker)
COPY package.json yarn.lock ./

# Instalar dependencias
RUN yarn install --frozen-lockfile

# Copiar código fuente
COPY . .

# Variable de entorno para la URL del backend
# En docker-compose se pasa como build arg
ARG REACT_APP_API_URL=http://localhost/
ENV REACT_APP_API_URL=$REACT_APP_API_URL

# Build de producción
RUN yarn build

# ── Stage 2: Copiar build al volumen ────────────────────────
FROM alpine:3.20

RUN apk add --no-cache rsync

COPY --from=build /app/build /app/build

# Al iniciar, copia el build al volumen montado y termina
CMD ["sh", "-c", "rsync -a --delete /app/build/ /app/output/ && echo 'Frontend build copiado OK'"]

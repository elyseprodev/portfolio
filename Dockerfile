# ELYSE DEV — API container image.
#
# Build from the REPOSITORY ROOT (the server imports the local `@elyse/database`
# workspace package, so the build needs the whole monorepo):
#
#   docker build -t elyse-dev-api .
#   docker run --rm -p 4000:4000 \
#     -e MONGODB_URI="mongodb+srv://…" \
#     -e CORS_ORIGIN="https://your-domain.com" \
#     elyse-dev-api
#
# Railway, Fly.io and any container host can use this image directly.

FROM node:22-alpine

WORKDIR /app

# System CA bundle — Node in slim containers sometimes misses it, which would
# break the GitHub proxy with a TLS error rather than a useful message.
RUN apk add --no-cache ca-certificates
ENV NODE_EXTRA_CA_CERTS=/etc/ssl/certs/ca-certificates.crt

# Install dependencies first so the layer is cached across code changes.
COPY package.json package-lock.json ./
COPY client/package.json ./client/package.json
COPY server/package.json ./server/package.json
COPY database/package.json ./database/package.json
RUN npm ci --include=dev

# Application code (the client workspace is copied because the content files in
# client/src/content are the source of truth the database layer syncs from).
COPY database ./database
COPY server ./server
COPY client/src/content ./client/src/content

ENV NODE_ENV=production
ENV PORT=4000
EXPOSE 4000

HEALTHCHECK --interval=30s --timeout=5s --start-period=15s \
  CMD node -e "fetch('http://127.0.0.1:'+(process.env.PORT||4000)+'/api/health').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"

CMD ["npm", "run", "start", "-w", "@elyse/server"]

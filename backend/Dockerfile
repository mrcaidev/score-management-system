FROM node:alpine AS builder
WORKDIR /app
COPY package.json .
RUN npm i
COPY . .
RUN npm run build

FROM node:alpine
WORKDIR /app
COPY --from=builder /app/dist .
CMD ["node", "index.cjs"]

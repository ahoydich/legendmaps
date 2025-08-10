FROM node:18
WORKDIR /app
COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* ./
RUN if [ -f yarn.lock ]; then yarn install; elif [ -f package-lock.json ]; then npm ci; elif [ -f pnpm-lock.yaml ]; then npm i -g pnpm && pnpm i; else yarn install; fi
COPY . .
EXPOSE 3000
ENV HOST=0.0.0.0
CMD ["sh", "-c", "if [ -f yarn.lock ]; then yarn dev -H 0.0.0.0; else npm run dev -- -H 0.0.0.0; fi"]
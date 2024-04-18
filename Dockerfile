FROM node:20.12.2-alpine3.18

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
ENV NODE_ENV=development
WORKDIR /usr/server
COPY ./ .
RUN apk update && apk add bash vim && npm install -g pnpm && pnpm add nextui-cli -g && pnpm i

CMD ["pnpm", "run", "dev"]
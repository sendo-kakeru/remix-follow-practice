DOCKER_CMD := docker-compose -f docker-compose.yml
APP_CMD := ${DOCKER_CMD} exec app


init:
	@make up
	sleep 10
	@make migrate-dev
up:
	${DOCKER_CMD} up
restart:
	${DOCKER_CMD} restart
down:
	${DOCKER_CMD} down
stop:
	${DOCKER_CMD} stop
destroy:
	${DOCKER_CMD} down --rmi all --volumes --remove-orphans
ps:
	${DOCKER_CMD} ps
remake:
	@make destroy
	@make init
migrate-dev:
	${APP_CMD} pnpm prisma migrate dev --name init
	@make generate
migrate:
	${APP_CMD} pnpm prisma db push
	@make generate
generate:
	${APP_CMD} pnpm prisma generate
	@make module
studio:
	${APP_CMD} pnpm prisma studio
in:
	${APP_CMD} bash
module:
	docker cp remix-follow-practise-app-1:/usr/server/node_modules ./


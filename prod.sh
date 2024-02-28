#!/bin/bash

npx nestia swagger

docker rm -f mini-post-server-nestjs

docker system prune -a -f

docker compose --env-file ./.env.prod up -d

#!/bin/bash

docker rm -f mini-post-server-nestjs

docker system prune -a -f

docker compose up -d

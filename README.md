## Development
- clone source code
- change .env.example to .env
- run command "npm install" to install all dependencies
- comment service mini-post-server-nestjs in docker-compose.yaml file
- run command: docker compose up -d to init database and redis service
- run command: npm run start:dev

## Production
- create own .env.prod file
- uncomment service mini-post-server-nestjs in docker-compose.yaml file
- run command: docker compose up -d
- then you will bring this image to every deployment environment

# Demo
- [HTTP Endpoint ](https://mini-post-api.vs-blog.tech/)
- [Swagger](https://mini-post-api.vs-blog.tech/swagger)
- [Socket Endpoint](wss://mini-post-socket.vs-blog.tech/chat)
- [Demo Video On Youtube](https://www.youtube.com/watch?v=VvWiES2GC6Y)


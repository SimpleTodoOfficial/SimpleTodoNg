# SimpleTodo - Angular Client

An angular client for simple Todo tracking with the SimpleTodoServer.

Based on Angular, SCSS, FontAwesome, Bootstrap and more.

## Copyright

2020 Denis Meyer, https://github.com/CallToPower

## Concept

### Workspaces

- Collaboration spaces for a group of users
- A workspace contains lists

### List

- Collaboration in a workspace for a specific task for the group of users of the workspace
- A list contains todos

### Todo

- Basic todo entity
- Containing e.g. a message and a due date

### Roles

- Roles for API authentication
- Current roles for authentication are ADMIN and USER

### Users

- Users have a role
- Users work together in different workspaces

### Other concepts

- There are no admin users for workspaces, lists and todos
- All users in a workspace can create/edit/delete everything, including the workspace.

## Run the full software stack on a linux server

### Production

- Change usernames, passwords, API_URL, etc. in "docker/stack.yml"
- Change the nginx configuration at "docker/nginx/nginx.prod.conf" and copy it over to "docker/nginx/nginx.conf" on your server
    - Make sure a reverse proxy is set up (example in nginx.conf), CORS-requests are not allowed in production
- Change the flyway db migration configuration at "docker/flyway/config/flyway.conf" and copy it over to "docker/flyway/config/flyway.conf" on your server
- Generate an ssl certificate for your domain, e.g. via https://letsencrypt.org
    - Install certbot
    - "sudo certbot certonly --standalone -d <yourDomain> -d www.<yourDomain>"
    - "cd /etc/letsencrypt/live/<yourDomain>"
    - "openssl pkcs12 -export -in fullchain.pem -inkey privkey.pem -out springboot_letsencrypt.p12 -name bootalias -CAfile chain.pem -caname root"
- Copy your ssl certificate "fullchain.pem" and "privkey.pem" to "data/certificates"
- Make sure to have the correct permissions for the mounted database folder: "sudo chown -R 1001:1001 data/db/"
- Start via "docker-compose -f docker/stack.yml up"
- Use "docker-compose -f docker/stack.yml up -d" to start in background

### File structure at your server

- stack.yml
- data/certificates/fullchain.pem
- data/certificates/privkey.pem
- docker/nginx/nginx.conf
- docker/nginx/mime.types
- docker/flyway/config/flyway.conf

### Infos

- The database is externalized and writes data to "docker/data/db" so it's not erased on container deletion.

## Stop the software

- Stop docker containers (e.g. "docker-compose -f ./docker/stack-dev.yml stop" or "docker-compose -f ./docker/stack.yml stop")

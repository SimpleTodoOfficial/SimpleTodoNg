# SimpleTodoNg

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 10.0.7.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files. Add `--open` to automatically open in browser.

## Requirements

Backend server: SimpleTodoServer: https://github.com/CallToPower/SimpleTodoServer

### Docker

#### Installation

- Instructions: https://hub.docker.com/editions/community/docker-ce-desktop-windows/

## Build for production

### Build the SimpleTodo Angular

- "docker image build -t simpletodo-ng -f docker/Dockerfile ."
- "docker login"
- "docker tag simpletodo-ng <dockerName>/simpletodo-ng:<version>"
- "docker push <dockerName>/simpletodo-ng:<version>"

## Run the software

Windows: On windows the user has to add the project folder in file sharing in order to activate bind mounting into Docker containers:

- Docker - Settings - Resources - + - Select "/path/to/SimpleTodoNg"

### Local development

- Start via "docker-compose -f docker/stack-dev.yml up"
- Database UI available at http://localhost:8080
- You might want to insert some example data: "resources/database.sql" + "resources/example-data.sql"
- Start frontend via "ng serve"

## Some useful docker commands

### List images

docker images

### Delete an image

docker image remove imgId1[, imgId2, ...]

### List all containers

docker container ls -a

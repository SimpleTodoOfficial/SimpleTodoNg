# SimpleTodo - Angular Client

An angular client for simple Todo tracking with the SimpleTodoServer.

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

## Installation

This software is provided via docker. More information in the producation and development documentation.

Available docker images:

- calltopower/simpletodo-flyway:1.4.2
- calltopower/simpletodo-db:1.4.2
- calltopower/simpletodo-server:1.4.2
- calltopower/simpletodo-ng:1.4.2

## Production and development documentation

See README-DEV.md.

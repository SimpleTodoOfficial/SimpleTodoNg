# SimpleTodoServer - Changelog

## v1.7.2

- Visual and handling optimizations

## v1.7.1

- Replaced the notification service with a library

## v1.7.0

- Java 17
- Gradle 7.4.1
- Spring 2.5.11
- Flyway 8.5.5
- More dependency updates

## v1.6.2

- Set autofocus
- Moved desktop notification set-up into "Menu"

## v1.6.1

- Fixed styling issues

## v1.6.0

- Version Upgrades (done)
	- Database
	- Database Migrations
	- Gradle
	- Java
	- Angular

## v1.5.8

- Fixed styling issues

## v1.5.7

- Fixed styling issues

## v1.5.6

- Upgrade to Java 11
- Update dependencies
- Upgrade to Angular 13

## v1.5.5

- Added a URL option to Todos

## v1.5.4

- File content cache
- New backend parameter for the max file string cache size: "simpletodo.cache.file.string.max"
- Fixed signup process where sometimes a user could not be created
- Non-admin users cannot see the edit button in user lists for other users then themselves any more
- Fixed windows line endings in the bootstrap script
- Hint if user cannot be updated

## v1.5.3

- New backend parameter for due todos to be displayed in the future, in minutes: "simpletodo.duetodos-minutes-plus"

## v1.5.2

- Fallback to alerts for due todos if desktop notifications are not available
- Option to remove the activate desktop notifications information

## v1.5.1

- Corrected date and time formats

## v1.5.0

- Added endpoint to get due Todos for a specific user
- Added desktop notifications
- Added due Todos overview

## v1.4.2

- Making sure on user update that one user with role ROLE_ADMIN exists at any time: User cannot be updated in case there is not at least one other user with role ROLE_ADMIN.
- Making sure on user delete that one user with role ROLE_ADMIN exists at any time: User cannot be deleted in case there is not at least one other user with role ROLE_ADMIN.
- Removed all "deleteAll" (workspaces, lists, totos, uders) methods
- Added more space between actions "move" and "delete" (lists, todos)

## v1.4.1

- Translation fixes
- Displaying random emoji in 90% of page transitions if enabled
- New frontend environment variable EMOJI
- Added privacy and security information to about

## v1.4.0

- Frontend notification handling improvements
- Welcome text
- Loading curtain
- Translation fix

## v1.3.3

- Backend language and translation delivery cleanup
- Frontend error handling improvements

## v1.3.2

- Language fallback optimizations
- Translation fix

## v1.3.1

- Moved the i18n files to the backend
- Optimized i18n load size

## v1.3.0

- i18n (german and english)

## v1.2.0

- Dependency version updates
- Email styling (HTML emails with Thymeleaf)

## v1.1.0

- Implemented moving lists to other workspaces
- Implemented moving todos to other lists

## v1.0.5

- Renamed activation to verification in both API and wording

## v1.0.4

- Frontend rewording
- Confirmation before resending email address activation token

## v1.0.3

- Email message rewording
- Always displaying SimpleTodo name on front page
- New frontend environment variable ISSUE_TRACKER_URL

## v1.0.2

- Added user (email) activation
- Bug fixes

## v1.0.1

- Added connectivity check to track session expirations
- Bug fixes

## v1.0.0

- Initial version

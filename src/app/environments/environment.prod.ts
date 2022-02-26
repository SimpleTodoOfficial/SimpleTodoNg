export const environment = {
    production: true,
    apiUrl: (window['env'] && window['env']['apiUrl']) ? window['env']['apiUrl'] : 'http://localhost/api',
    version: (window['env'] && window['env']['version']) ? window['env']['version'] : ' unregistered',
    signup: (window['env'] && window['env']['signup']) ? window['env']['signup'] != 'DISABLED' : true,
    emoji: (window['env'] && window['env']['emoji']) ? window['env']['emoji'] != 'DISABLED' : false,
    issueTracker: (window['env'] && window['env']['issueTracker']) ? window['env']['issueTracker'] : 'https://github.com/SimpleTodoOfficial/SimpleTodoNg/issues',
    connectionPath: {
        main: 'connection',
        available: 'available',
        authorized: 'authorized',
    },
    authPath: {
        main: 'auth',
        signup: 'signup',
        signin: 'signin'
    },
    i18nPath: {
        main: 'i18n',
        languages: 'languages'
    },
    usersPath: {
        main: 'users',
        password: {
            main: 'password',
            forgot: 'forgot',
            reset: 'reset'
        },
        verify: {
            main: 'verify',
            resend: 'resend'
        },
        todos: {
            due: 'duetodos'
        }
    },
    workspacesPath: {
        main: 'workspaces'
    },
    listsPath: {
        main: 'lists',
        move: 'move'
    },
    todosPath: {
        main: 'todos',
        move: 'move'
    }
};

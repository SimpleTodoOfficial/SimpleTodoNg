export const environment = {
    production: true,
    apiUrl: (window['env'] && window['env']['apiUrl']) ? window['env']['apiUrl'] : 'http://localhost/api',
    version: (window['env'] && window['env']['version']) ? window['env']['version'] : ' unregistered',
    signup: (window['env'] && window['env']['signup']) ? window['env']['signup'] != 'DISABLED' : true,
    issueTracker: (window['env'] && window['env']['issueTracker']) ? window['env']['issueTracker'] : 'https://github.com/CallToPower/SimpleTodoNg/issues',
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
        }
    },
    workspacesPath: 'workspaces',
    listsPath: 'lists',
    todosPath: 'todos'
};

export const environment = {
    production: false,
    apiUrl: (window['env'] && window['env']['apiUrl']) ? window['env']['apiUrl'] : 'http://localhost:9090/api',
    version: (window['env'] && window['env']['version']) ? window['env']['version'] : ' unregistered',
    signup: (window['env'] && window['env']['signup']) ? window["env"]["signup"] != 'DISABLED' : true,
    authPath: {
        main: 'auth',
        signup: 'signup',
        sigin: 'signin'
    },
    usersPath: {
        main: 'users',
        password: {
            main: 'password',
            forgot: 'forgot',
            reset: 'reset'
        }
    },
    workspacesPath: 'workspaces',
    listsPath: 'lists',
    todosPath: 'todos'
};

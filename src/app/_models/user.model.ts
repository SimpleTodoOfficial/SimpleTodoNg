export class User {

    constructor(
        public token: string,
        public id: string,
        public username: string,
        public password: string,
        public email: string,
        public roles: string[],
        public jsonData: string
    ) {
        // Nothing to see here...
    }

}

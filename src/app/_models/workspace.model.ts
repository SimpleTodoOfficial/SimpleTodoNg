export class Workspace {

    constructor(
        public id: string,
        public createdDate: string,
        public name: string,
        public users: string[],
        public lists: string[],
        public jsonData: string
    ) {
        // Nothing to see here...
    }

}

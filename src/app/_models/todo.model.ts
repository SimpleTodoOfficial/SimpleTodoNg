export class Todo {

    constructor(
        public id: string,
        public msg: string,
        public done: boolean,
        public workspaceId: string,
        public workspaceName: string,
        public listId: string,
        public listName: string,
        public dueDate: string,
        public jsonData: string
    ) {
        // Nothing to see here...
    }

}

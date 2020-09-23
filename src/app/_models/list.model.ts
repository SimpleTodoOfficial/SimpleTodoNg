import { Todo } from './todo.model';

export class List {

    constructor(
        public id: string,
        public createdDate: string,
        public name: string,
        public workspaceId: string,
        public workspaceName: string,
        public todos: Todo[],
        public jsonData: string
    ) {
        // Nothing to see here...
    }

}

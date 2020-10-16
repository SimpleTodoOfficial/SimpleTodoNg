import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { LoggerService } from './logger.service';
import { environment } from '../environments/environment';
import { Todo } from '../_models/todo.model';

@Injectable({
    providedIn: 'root'
})
export class TodoService {

    constructor(
        private http: HttpClient,
        private logger: LoggerService
    ) {
        // Nothing to see here...
    }

    getAll(wsId: string, lsId: string) {
        let url = `${environment.apiUrl}/${environment.workspacesPath.main}/${wsId}/${environment.listsPath.main}/${lsId}/${environment.todosPath.main}`;
        this.logger.log('Getting all todos, URL: ' + url);

        return this.http.get<Todo[]>(url);
    }

    getById(wsId: string, lsId: string, id: string) {
        let url = `${environment.apiUrl}/${environment.workspacesPath.main}/${wsId}/${environment.listsPath.main}/${lsId}/${environment.todosPath.main}/${id}`;
        this.logger.log('Getting todo, URL: ' + url);

        return this.http.get<Todo>(url);
    }

    create(wsId: string, lsId: string, todo: Todo) {
        let url = `${environment.apiUrl}/${environment.workspacesPath.main}/${wsId}/${environment.listsPath.main}/${lsId}/${environment.todosPath.main}`;
        this.logger.log('Creating todo, URL: ' + url);

        return this.http.post(url, todo);
    }

    update(wsId: string, lsId: string, id: string, params) {
        let url = `${environment.apiUrl}/${environment.workspacesPath.main}/${wsId}/${environment.listsPath.main}/${lsId}/${environment.todosPath.main}/${id}`;
        this.logger.log('Updating todo, URL: ' + url);

        return this.http.put(url, params);
    }

    move(wsId: string, lsId: string, id: string, newLsId: string) {
        let url = `${environment.apiUrl}/${environment.workspacesPath.main}/${wsId}/${environment.listsPath.main}/${lsId}/${environment.todosPath.main}/${id}/${environment.todosPath.move}`;
        this.logger.log('Moving todo, URL: ' + url);

        let params = {
            'listId': newLsId
        };
        return this.http.put(url, params);
    }

    delete(wsId: string, lsId: string, id: string) {
        let url = `${environment.apiUrl}/${environment.workspacesPath.main}/${wsId}/${environment.listsPath.main}/${lsId}/${environment.todosPath.main}/${id}`;
        this.logger.log('Deleting todo, URL: ' + url);

        return this.http.delete(url);
    }

}

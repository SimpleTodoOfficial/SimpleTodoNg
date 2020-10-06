import { Injectable, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

import { LoggerService } from './logger.service';
import { environment } from '../environments/environment';
import { Todo } from '../_models/todo.model';

@Injectable({
    providedIn: 'root'
})
export class TodoService implements OnInit, OnDestroy {

    constructor(
        private http: HttpClient,
        private logger: LoggerService
    ) {
        // Nothing to see here...
    }

    ngOnInit() {
        this.logger.log('Initializing TodoService');
    }

    ngOnDestroy() {
        this.logger.log('Destroying TodoService');
    }

    getAll(wsId: string, lsId: string) {
        let url = `${environment.apiUrl}/${environment.workspacesPath}/${wsId}/${environment.listsPath}/${lsId}/${environment.todosPath}`;
        this.logger.log('Getting all todos, URL: ' + url);

        return this.http.get<Todo[]>(url);
    }

    getById(wsId: string, lsId: string, id: string) {
        let url = `${environment.apiUrl}/${environment.workspacesPath}/${wsId}/${environment.listsPath}/${lsId}/${environment.todosPath}/${id}`;
        this.logger.log('Getting todo, URL: ' + url);

        return this.http.get<Todo>(url);
    }

    create(wsId: string, lsId: string, todo: Todo) {
        let url = `${environment.apiUrl}/${environment.workspacesPath}/${wsId}/${environment.listsPath}/${lsId}/${environment.todosPath}`;
        this.logger.log('Creating todo, URL: ' + url);

        return this.http.post(url, todo);
    }

    update(wsId: string, lsId: string, id: string, params) {
        let url = `${environment.apiUrl}/${environment.workspacesPath}/${wsId}/${environment.listsPath}/${lsId}/${environment.todosPath}/${id}`;
        this.logger.log('Updating todo, URL: ' + url);

        return this.http.put(url, params);
    }

    delete(wsId: string, lsId: string, id: string) {
        let url = `${environment.apiUrl}/${environment.workspacesPath}/${wsId}/${environment.listsPath}/${lsId}/${environment.todosPath}/${id}`;
        this.logger.log('Deleting todo, URL: ' + url);

        return this.http.delete(url);
    }

}

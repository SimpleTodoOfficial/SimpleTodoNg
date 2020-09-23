import { Injectable, OnInit, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { LoggerService } from './logger.service';
import { environment } from '../environments/environment';
import { List } from '../_models/list.model';

@Injectable({
    providedIn: 'root'
})
export class ListService implements OnInit, OnDestroy {

    constructor(
        private logger: LoggerService,
        private http: HttpClient
    ) {
        // Nothing to see here...
    }

    ngOnInit() {
        this.logger.log('Initializing ListService');
    }

    ngOnDestroy() {
        this.logger.log('Destroying ListService');
    }

    getAll(wsId: string) {
        let url = `${environment.apiUrl}/${environment.workspacesPath}/${wsId}/${environment.listsPath}`;
        this.logger.log('Getting all lists, URL: ' + url);

        return this.http.get<List[]>(url);
    }

    getById(wsId: string, id: string) {
        let url = `${environment.apiUrl}/${environment.workspacesPath}/${wsId}/${environment.listsPath}/${id}`;
        this.logger.log('Getting list, URL: ' + url);

        return this.http.get<List>(url);
    }

    create(wsId: string, list: List) {
        let url = `${environment.apiUrl}/${environment.workspacesPath}/${wsId}/${environment.listsPath}`;
        this.logger.log('Creating list, URL: ' + url);

        return this.http.post(url, list);
    }

    update(wsId: string, id: string, params) {
        let url = `${environment.apiUrl}/${environment.workspacesPath}/${wsId}/${environment.listsPath}/${id}`;
        this.logger.log('Updating list, URL: ' + url);

        return this.http.put(url, params);
    }

    delete(wsId: string, id: string) {
        let url = `${environment.apiUrl}/${environment.workspacesPath}/${wsId}/${environment.listsPath}/${id}`;
        this.logger.log('Deleting list, URL: ' + url);

        return this.http.delete(url);
    }

}

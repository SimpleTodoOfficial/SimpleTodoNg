import { Injectable, OnInit, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { LoggerService } from './logger.service';
import { environment } from '../environments/environment';
import { Workspace } from '../_models/workspace.model';

@Injectable({
    providedIn: 'root'
})
export class WorkspaceService implements OnInit, OnDestroy {

    constructor(
        private http: HttpClient,
        private logger: LoggerService
    ) {
        // Nothing to see here...
    }

    ngOnInit() {
        this.logger.log('Initializing WorkspaceService');
    }

    ngOnDestroy() {
        this.logger.log('Destroying WorkspaceService');
    }

    getAll() {
        let url = `${environment.apiUrl}/${environment.workspacesPath.main}`;
        this.logger.log('Getting all workspaces, URL: ' + url);

        return this.http.get<Workspace[]>(url);
    }

    getById(id: string) {
        let url = `${environment.apiUrl}/${environment.workspacesPath.main}/${id}`;
        this.logger.log('Getting workspace, URL: ' + url);

        return this.http.get<Workspace>(url);
    }

    create(workspace: Workspace) {
        let url = `${environment.apiUrl}/${environment.workspacesPath.main}`;
        this.logger.log('Creating workspace, URL: ' + url);

        return this.http.post(url, workspace);
    }

    update(id, params) {
        let url = `${environment.apiUrl}/${environment.workspacesPath.main}/${id}`;
        this.logger.log('Updating workspace, URL: ' + url);

        return this.http.put(url, params);
    }

    delete(id: string) {
        let url = `${environment.apiUrl}/${environment.workspacesPath.main}/${id}`;
        this.logger.log('Deleting workspace, URL: ' + url);

        return this.http.delete(url);
    }

}

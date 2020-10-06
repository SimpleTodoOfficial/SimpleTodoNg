import { Injectable, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { first } from 'rxjs/operators';
import { Subscription } from 'rxjs';

import { environment } from '../environments/environment';
import { LoggerService } from './logger.service';
import { WorkspaceService } from './workspace.service';
import { AlertService } from './alert.service';
import { UserService } from './user.service';

@Injectable({
    providedIn: 'root'
})
export class ConnectionService implements OnInit, OnDestroy {
    private sub: Subscription;
    private lastErrorTimestamp = 0;

    constructor(
        private router: Router,
        private http: HttpClient,
        private logger: LoggerService,
        private workspaceService: WorkspaceService,
        private userService: UserService,
        private alertService: AlertService
    ) {
        // Nothing to see here...
    }

    ngOnInit() {
        this.logger.log('Initializing ConnectionService');
    }

    ngOnDestroy() {
        this.logger.log('Destroying ConnectionService');

        if (this.sub) {
            this.sub.unsubscribe();
        }
    }

    assertConnection() {
        if (this.sub) {
            this.sub.unsubscribe();
        }

        let url = `${environment.apiUrl}/${environment.connectionPath.main}/${environment.connectionPath.authorized}`;
        this.logger.log('Asserting connection, URL: ' + url);

        this.sub = this.http.get<any>(url)
            .pipe(first())
            .subscribe(result => {
                this.logger.log('Connection OK');
            },
                error => {
                    let currentTimestamp = new Date().getTime();
                    if ((currentTimestamp - this.lastErrorTimestamp) >= 3000) {
                        this.logger.log('Connection not OK');
                        this.userService.signout();
                        this.alertService.warn('You have been signed out because your session has expired. Please sign in again.');
                    }
                    this.lastErrorTimestamp = currentTimestamp;
                });
    }

}

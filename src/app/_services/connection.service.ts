import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { first } from 'rxjs/operators';
import { Subscription } from 'rxjs';

import { environment } from '../environments/environment';
import { LoggerService } from './logger.service';
import { AlertService } from './alert.service';
import { UserService } from './user.service';
import { I18nService } from './i18n.service';

@Injectable({
    providedIn: 'root'
})
export class ConnectionService {
    private sub: Subscription;
    private lastErrorTimestamp = 0;

    constructor(
        private http: HttpClient,
        private logger: LoggerService,
        private i18nService: I18nService,
        private userService: UserService,
        private alertService: AlertService
    ) {
        // Nothing to see here...
    }

    assertConnection() {
        if (this.sub) {
            this.sub.unsubscribe();
        }

        let url = `${environment.apiUrl}/${environment.connectionPath.main}/${environment.connectionPath.authorized}`;
        this.logger.log('Asserting connection, URL: ' + url);

        this.sub = this.http.get<any>(url)
            .pipe(first())
            .subscribe({
                next: result => {
                    this.logger.log('Connection OK');
                },
                error: error => {
                    let currentTimestamp = new Date().getTime();
                    if ((currentTimestamp - this.lastErrorTimestamp) >= 3000) {
                        this.logger.log('Connection not OK');
                        this.userService.signout();
                        this.alertService.warn(this.i18nService.translate('connection.service.signed_out', 'You have been signed out because your session has expired. Please sign in again.'), { autoClose: false });
                    }
                    this.lastErrorTimestamp = currentTimestamp;
                }
            });
    }

}

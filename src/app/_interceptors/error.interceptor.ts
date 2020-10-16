import { Injectable, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { environment } from '../environments/environment';
import { LoggerService, AlertService, I18nService, ConnectionService } from '../_services';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor, OnInit, OnDestroy {
    private checkUrlsEndsWithArr = [
        `${environment.apiUrl}/${environment.connectionPath.main}/${environment.connectionPath.authorized}`,
        `${environment.apiUrl}/${environment.authPath.main}/${environment.authPath.signin}`,
        `${environment.apiUrl}/${environment.authPath.main}/${environment.authPath.signup}`,
        `${environment.apiUrl}/${environment.usersPath.main}/${environment.usersPath.password.main}/${environment.usersPath.password.forgot}`
    ];
    private checkUrlsContainsArr = [
        `${environment.apiUrl}/${environment.i18nPath.main}/${environment.i18nPath.languages}`
    ];

    constructor(
        private i18nService: I18nService,
        private alertService: AlertService,
        private connectionService: ConnectionService,
        private router: Router,
        private logger: LoggerService
    ) {
        // Nothing to see here...
    }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(request).pipe(catchError(err => {
            // Attention: Expired tokens throw a 404, NOT a 401!
            if (err.status === 401 || err.status === 405) {
                this.logger.log('Resource not accessible');
                this.router.navigate(['/']);
                this.alertService.warn(this.i18nService.translate('app.error.not_accessible', 'The request ressource is not accessible.'));
            } else {
                if (!request.url.startsWith(`${environment.apiUrl}`)) {
                    this.logger.log('Something went wrong on non-API path');
                    this.alertService.error(this.i18nService.translate('app.error.something_went_wrong', 'Something went wrong.'));
                } else {
                    let endsWithCheck = false;
                    for (let i in this.checkUrlsEndsWithArr) {
                        if (request.url.endsWith(this.checkUrlsEndsWithArr[i])) {
                            endsWithCheck = true;
                            break;
                        }
                    }
                    let containsCheck = false;
                    for (let i in this.checkUrlsContainsArr) {
                        if (request.url.indexOf(this.checkUrlsContainsArr[i]) != -1) {
                            containsCheck = true;
                            break;
                        }
                    }
                    if (!endsWithCheck && !containsCheck) {
                        this.logger.log('Asserting connection');
                        this.connectionService.assertConnection();
                    } else {
                        this.logger.log('Ignoring alerting on API paths');
                    }
                }
            }

            const error = err.error ? err.error.message : err.statusText;

            return throwError(error);
        }));
    }

    ngOnInit() {
        this.logger.log('Initializing ErrorInterceptor');
    }

    ngOnDestroy() {
        this.logger.log('Destroying ErrorInterceptor');
    }

}

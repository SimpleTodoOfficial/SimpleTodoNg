import { Injectable, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { environment } from '../environments/environment';
import { LoggerService, AlertService, I18nService, ConnectionService } from '../_services';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor, OnInit, OnDestroy {
    private ignoreRedirectionOnErrorPaths: string[] = [];
    private checkConnectionUrl = `${environment.apiUrl}/${environment.connectionPath.main}/${environment.connectionPath.authorized}`;
    private signinUrl = `${environment.apiUrl}/${environment.authPath.main}/${environment.authPath.signin}`;
    private signupUrl = `${environment.apiUrl}/${environment.authPath.main}/${environment.authPath.signup}`;
    private passwordForgotUrl = `${environment.apiUrl}/${environment.usersPath.main}/${environment.usersPath.password.main}/${environment.usersPath.password.forgot}`;

    constructor(
        private i18nService: I18nService,
        private alertService: AlertService,
        private connectionService: ConnectionService,
        private router: Router,
        private logger: LoggerService
    ) {
        this.ignoreRedirectionOnErrorPaths.push(`${environment.apiUrl}/${environment.authPath.main}/${environment.authPath.signup}`);
        this.ignoreRedirectionOnErrorPaths.push(`${environment.apiUrl}/${environment.usersPath.main}/add`);
    }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(request).pipe(catchError(err => {
            // Attention: Expired tokens throw a 404, NOT a 401!
            if (err.status === 401 || err.status === 405) {
                this.logger.log('Resource not accessible');
                // this.userService.signout();
                this.router.navigate(['/']);
                this.alertService.warn(this.i18nService.translate('app.error.not_accessible', 'The request ressource is not accessible.'));
            } else {
                if (!request.url.startsWith(`${environment.apiUrl}`)) {
                    this.logger.log('Something went wrong on non-API path');
                    this.alertService.error(this.i18nService.translate('app.error.something_went_wrong', 'Something went wrong.'));
                } else {
                    if (!request.url.endsWith(this.checkConnectionUrl)
                        && !request.url.endsWith(this.signinUrl)
                        && !request.url.endsWith(this.signupUrl)
                        && !request.url.endsWith(this.passwordForgotUrl)) {
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

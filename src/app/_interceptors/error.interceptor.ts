import { Injectable, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { environment } from '../environments/environment';
import { LoggerService, AlertService, UserService } from '../_services';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor, OnInit, OnDestroy {
    private ignoreRedirectionOnErrorPaths: string[] = [];

    constructor(
        private userService: UserService,
        private alertService: AlertService,
        private router: Router,
        private logger: LoggerService
    ) {
        this.ignoreRedirectionOnErrorPaths.push(`${environment.apiUrl}/${environment.authPath.main}/${environment.authPath.signup}`);
        this.ignoreRedirectionOnErrorPaths.push(`${environment.apiUrl}/${environment.usersPath.main}/add`);
    }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(request).pipe(catchError(err => {
            if (err.status === 401 || err.status === 405) {
                this.logger.log('You have been signed out because your session has expired. Please sign in again.');
                this.userService.signout();
                this.router.navigate(['/']);
                this.alertService.warn('You have been signed out because your session has expired. Please sign in again.');
            } else {
                if (!request.url.startsWith(`${environment.apiUrl}`)) {
                    this.logger.log('Something went wrong on non-API path');
                    this.alertService.error('Something went wrong.');
                } else {
                    this.logger.log('Ignoring alerting on api paths');
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

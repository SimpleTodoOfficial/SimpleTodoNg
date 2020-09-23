import { Injectable, OnInit, OnDestroy } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../environments/environment';
import { LoggerService, UserService } from '../_services';

@Injectable()
export class TokenInterceptor implements HttpInterceptor, OnInit, OnDestroy {

    constructor(
        private userService: UserService,
        private logger: LoggerService
    ) {
        // Nothing to see here...
    }

    ngOnInit() {
        this.logger.log('Initializing TokenInterceptor');
    }

    ngOnDestroy() {
        this.logger.log('Destroying TokenInterceptor');
    }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const isLoggedIn = this.userService.isLoggedIn();
        const isApiUrl = request.url.startsWith(environment.apiUrl);
        if (isLoggedIn && isApiUrl) {
            request = request.clone({
                setHeaders: {
                    Authorization: `Bearer ${this.userService.getUser().token}`
                }
            });
        }

        return next.handle(request);
    }

}

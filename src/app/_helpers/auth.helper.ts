import { Injectable, OnInit, OnDestroy } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { LoggerService, UserService } from '../_services';

@Injectable({
    providedIn: 'root'
})
export class AuthHelper implements CanActivate, OnInit, OnDestroy {

    constructor(
        private router: Router,
        private UserService: UserService,
        private logger: LoggerService
    ) {
        // Nothing to see here...
    }

    ngOnInit() {
        this.logger.log('Initializing AuthHelper');
    }

    ngOnDestroy() {
        this.logger.log('Destroying AuthHelper');
    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        if (this.UserService.isLoggedIn()) {
            this.logger.log('Account is logged in, can activate route.');
            return true;
        }

        this.logger.log('Account is not logged in, cannot activate route.');
        this.router.navigate(['/account/signin'], { queryParams: { returnUrl: state.url } });
        return false;
    }

}

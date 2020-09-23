import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';

import { LoggerService, UserService } from '../_services';

@Component({
    templateUrl: 'layout.component.html',
    styleUrls: ['./layout.component.scss']
})
export class LayoutComponent implements OnInit, OnDestroy {

    constructor(
        private router: Router,
        private userService: UserService,
        private logger: LoggerService
    ) {
        if (this.userService.userValue) {
            this.router.navigate(['/']);
        }
    }

    ngOnInit() {
        this.logger.log('Initializing LayoutComponent (Account)');
    }

    ngOnDestroy() {
        this.logger.log('Destroying LayoutComponent (Account)');
    }

}

import { Component, OnInit, OnDestroy } from '@angular/core';

import { LoggerService } from '../_services/logger.service';

@Component({
    templateUrl: 'layout.component.html',
    styleUrls: ['./lists.component.scss']
})
export class LayoutComponent implements OnInit, OnDestroy {

    constructor(
        private logger: LoggerService
    ) {
        // Nothing to see here...
    }

    ngOnInit() {
        this.logger.log('Initializing LayoutComponent (List)');
    }

    ngOnDestroy() {
        this.logger.log('Destroying LayoutComponent (List)');
    }

}

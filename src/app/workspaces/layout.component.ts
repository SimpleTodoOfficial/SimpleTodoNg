import { Component, OnInit, OnDestroy } from '@angular/core';

import { LoggerService } from '../_services/logger.service';

@Component({
    templateUrl: 'layout.component.html',
    styleUrls: ['./workspaces.component.scss']
})
export class LayoutComponent implements OnInit, OnDestroy {

    constructor(
        private logger: LoggerService
    ) {
        // Nothing to see here...
    }

    ngOnInit() {
        this.logger.log('Initializing LayoutComponent (Workspace)');
    }

    ngOnDestroy() {
        this.logger.log('Destroying LayoutComponent (Workspace)');
    }

}

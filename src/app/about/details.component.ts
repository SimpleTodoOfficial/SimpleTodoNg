import { Component, OnInit, OnDestroy } from '@angular/core';
import { faAddressCard, faCodeBranch, faUserEdit, faBug } from '@fortawesome/free-solid-svg-icons';

import { environment } from '../environments/environment';
import { LoggerService, I18nService } from '../_services';

@Component({
    templateUrl: 'details.component.html',
    styleUrls: ['./about.component.scss']
})
export class DetailsComponent implements OnInit, OnDestroy {
    public version = environment.version;
    public issueTrackerLink = environment.issueTracker;

    public faAddressCard = faAddressCard;
    public faCodeBranch = faCodeBranch;
    public faUserEdit = faUserEdit;
    public faBug = faBug;

    constructor(
        public i18nService: I18nService,
        private logger: LoggerService
    ) {
    }

    ngOnInit() {
        this.logger.log('Initializing DetailsComponent (About)');
    }

    ngOnDestroy() {
        this.logger.log('Destroying DetailsComponent (About)');
    }

}

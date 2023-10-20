import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { first } from 'rxjs/operators';

import { Workspace } from '../_models';
import { LoggerService, AlertService, WorkspaceService, I18nService } from '../_services';

@Component({
    selector: 'ngbd-modal-move-list',
    templateUrl: 'move-list.modal.html',
    styleUrls: ['./move-list.modal.scss']
})
export class ModalMoveList implements OnInit, OnDestroy {
    public header: string = '';
    public text: string = '';

    public loading = false;
    public workspaces = [];
    public excludeWsId = '';

    private wssSub: Subscription;

    constructor(
        public i18nService: I18nService,
        public modal: NgbActiveModal,
        private alertService: AlertService,
        private workspaceService: WorkspaceService,
        private logger: LoggerService
    ) {
        // Nothing to see here...
    }

    ngOnInit() {
        this.logger.log('Initializing ModalMoveList');

        this.refresh();
    }

    ngOnDestroy() {
        this.logger.log('Destroying ModalMoveList');

        if (this.wssSub) {
            this.wssSub.unsubscribe();
        }
    }

    refresh() {
        this.logger.log('Refreshing workspaces');

        this.loading = true;

        if (this.wssSub) {
            this.wssSub.unsubscribe();
        }
        this.wssSub = this.workspaceService.getAll()
            .pipe(first())
            .subscribe({
                next: workspaces => {
                    this.workspaces = workspaces.filter(ws => ws.id !== this.excludeWsId);
                    workspaces.sort(function (a: Workspace, b: Workspace) {
                        return a.name.localeCompare(b.name);
                    });
                    this.loading = false;
                },
                error: error => {
                    this.logger.error(error);
                    this.alertService.error(this.i18nService.translate('move-list.modal.workspaces_load', 'Workspaces could not be loaded.'));
                    this.loading = false;
                    this.modal.dismiss('error');
                }
            });
    }

}

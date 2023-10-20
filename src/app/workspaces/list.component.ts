import { Component, OnInit, OnDestroy } from '@angular/core';
import { BreakpointObserver } from '@angular/cdk/layout';
import { first } from 'rxjs/operators';
import { faTh, faPlusCircle, faInfoCircle, faSync } from '@fortawesome/free-solid-svg-icons';

import { LoggerService, WorkspaceService, AlertService, I18nService } from '../_services';
import { Workspace } from '../_models';
import { Subscription } from 'rxjs';

@Component({
    templateUrl: 'list.component.html',
    styleUrls: ['./workspaces.component.scss']
})
export class ListComponent implements OnInit, OnDestroy {
    public loading = false;
    public refreshing = false;
    public error = false;
    public workspaces = [];
    public shortenWsName: number = 15;
    private wssSub: Subscription;
    private obSub: Subscription;

    public faTh = faTh;
    public faPlusCircle = faPlusCircle;
    public faInfoCircle = faInfoCircle;
    public faSync = faSync;

    constructor(
        public i18nService: I18nService,
        private observer: BreakpointObserver,
        private alertService: AlertService,
        private workspaceService: WorkspaceService,
        private logger: LoggerService
    ) {
        this.observerScreenSize();
    }

    ngOnInit() {
        this.logger.log('Initializing ListComponent (Workspaces)');

        this.loading = true;
        this.refresh();
    }

    ngOnDestroy() {
        this.logger.log('Destroying ListComponent (Workspaces)');

        if (this.wssSub) {
            this.wssSub.unsubscribe();
        }
        if (this.obSub) {
            this.obSub.unsubscribe();
        }
    }

    refresh() {
        this.logger.log('Refreshing workspaces');

        this.refreshing = true;
        if (this.wssSub) {
            this.wssSub.unsubscribe();
        }
        this.wssSub = this.workspaceService.getAll()
            .pipe(first())
            .subscribe({
                next: workspaces => {
                    this.workspaces = workspaces;
                    workspaces.sort(function(a: Workspace, b: Workspace){
                        return a.name.localeCompare(b.name);
                    });
                    this.loading = false;
                    this.refreshing = false;
                    this.error = false;
                },
                error: error => {
                    this.logger.error(error);
                    this.alertService.error(this.i18nService.translate('workspaces.list.component.error.workspaces_load', 'Workspaces could not be loaded.'));
                    this.loading = false;
                    this.refreshing = false;
                    this.error = true;
                }
            });
    }

    observerScreenSize(): void {
        this.obSub = this.observer.observe([
            '(min-width: 300px)',
            '(min-width: 400px)',
            '(min-width: 500px)',
            '(min-width: 600px)',
            '(min-width: 700px)',
            '(min-width: 800px)'
        ]).subscribe(result => {
            if (result.matches) {
                if (result.breakpoints['(min-width: 800px)']) {
                    this.shortenWsName = 90;
                } else if (result.breakpoints['(min-width: 700px)']) {
                    this.shortenWsName = 65;
                } else if (result.breakpoints['(min-width: 600px)']) {
                    this.shortenWsName = 60;
                } else if (result.breakpoints['(min-width: 500px)']) {
                    this.shortenWsName = 50;
                } else if (result.breakpoints['(min-width: 400px)']) {
                    this.shortenWsName = 40;
                } else if (result.breakpoints['(min-width: 300px)']) {
                    this.shortenWsName = 30;
                } else {
                    this.shortenWsName = 25;
                }
            } else {
                this.shortenWsName = 25;
            }
        });
    }

    deleteWorkspace(id: string) {
        const workspace = this.workspaces.find(x => x.id === id);
        workspace.isDeleting = true;
        if (this.wssSub) {
            this.wssSub.unsubscribe();
        }
        this.wssSub = this.workspaceService.delete(id)
            .pipe(first())
            .subscribe(() => {
                this.workspaces = this.workspaces.filter(x => x.id !== id)
            });
    }

}

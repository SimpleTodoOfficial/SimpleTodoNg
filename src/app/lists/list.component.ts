import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { BreakpointObserver } from '@angular/cdk/layout';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { first } from 'rxjs/operators';
import { faGripLines, faSync, faTh, faClipboardList, faPlusCircle, faInfoCircle, faUserCircle } from '@fortawesome/free-solid-svg-icons';

import { LoggerService, ListService, WorkspaceService, AlertService, I18nService } from '../_services';
import { Workspace, List } from '../_models';
import { Subscription } from 'rxjs';

@Component({
    templateUrl: 'list.component.html',
    styleUrls: ['./lists.component.scss']
})
export class ListComponent implements OnInit, OnDestroy {
    public loading = false;
    public refreshing = false;
    public workspace: Workspace;
    public lists = [];
    public listList = [];
    public shortenWsName: number = 15;
    public shortenLsName: number = 15;
    public isUpdatingListList: boolean = false;
    private wsId: string;
    private rtSub: Subscription;
    private rtppSub: Subscription;
    private lssSub: Subscription;
    private wssSub: Subscription;
    private obSub: Subscription;

    public faTh = faTh;
    public faClipboardList = faClipboardList;
    public faPlusCircle = faPlusCircle;
    public faInfoCircle = faInfoCircle;
    public faUserCircle = faUserCircle;
    public faSync = faSync;
    public faGripLines = faGripLines;

    constructor(
        public i18nService: I18nService,
        private router: Router,
        private observer: BreakpointObserver,
        private route: ActivatedRoute,
        private listService: ListService,
        private alertService: AlertService,
        private workspaceService: WorkspaceService,
        private logger: LoggerService
    ) {
        this.observerScreenSize();
    }

    ngOnInit() {
        this.rtSub = this.route.params.subscribe(params => this.init());
    }

    ngOnDestroy() {
        this.logger.log('Destroying ListComponent (Lists)');

        if (this.rtSub) {
            this.rtSub.unsubscribe();
        }
        if (this.rtppSub) {
            this.rtppSub.unsubscribe();
        }
        if (this.lssSub) {
            this.lssSub.unsubscribe();
        }
        if (this.wssSub) {
            this.wssSub.unsubscribe();
        }
        if (this.obSub) {
            this.obSub.unsubscribe();
        }
    }

    init() {
        this.logger.log('Initializing ListComponent (Lists)');

        this.loading = true;

        this.refresh();
    }

    refresh() {
        this.logger.log('Refreshing lists');

        this.refreshing = true;

        if (this.rtppSub) {
            this.rtppSub.unsubscribe();
        }
        this.rtppSub = this.route.parent.params.subscribe(params => {
            this.wsId = params['id'];

            if (this.lssSub) {
                this.lssSub.unsubscribe();
            }
            this.lssSub = this.listService.getAll(this.wsId)
                .pipe(first())
                .subscribe(lists => {
                    this.lists = lists;

                    if (this.wssSub) {
                        this.wssSub.unsubscribe();
                    }
                    this.wssSub = this.workspaceService.getById(this.wsId)
                        .pipe(first())
                        .subscribe(workspace => {
                            this.workspace = workspace;
                            this.calculateLists();
                            this.loading = false;
                            this.refreshing = false;
                        },
                            error => {
                                this.logger.error(error);
                                this.router.navigate(['/']);
                                this.alertService.error(this.i18nService.translate('lists.list.component.error.workspace_load', 'Workspace could not be loaded.'));
                            });
                },
                    error => {
                        this.logger.error(error);
                        this.router.navigate(['/']);
                        this.alertService.error(this.i18nService.translate('lists.list.component.error.list_load', 'List could not be loaded.'));
                    });
        });
    }

    calculateLists(): void {
        let lList = this.lists;
        let listList = [];

        this.logger.log('Checking for sorted data on the workspace');
        let foundList = [];
        if (this.workspace.jsonData) {
            let jsonData = JSON.parse(this.workspace.jsonData);
            if (jsonData && jsonData.list) {
                this.logger.log('Found workspace JSON data');
                foundList = jsonData.list;
            } else {
                this.logger.log('Found jsonData, but did not find list JSON data on the workspace');
            }
        } else {
            this.logger.log('No jsonData found on the workspace');
        }

        this.logger.log('Updating list data');
        let localList = lList.map(l => l.id);
        for (let i in foundList) {
            if (localList.includes(foundList[i])) {
                listList.push(foundList[i]);
            }
        }
        for (let i in localList) {
            if (!listList.includes(localList[i])) {
                listList.push(localList[i]);
            }
        }

        this.logger.log('Mapping list data');
        this.listList = listList.map(lId => this.getList(lId));

        let updateWs = false;
        let arrBefore = foundList;
        let arrAfter = this.listList.map(l => l.id);
        if (arrBefore.length != arrAfter.length) {
            updateWs = true;
        } else {
            for (let elPos in arrBefore) {
                if (arrBefore[elPos] !== arrAfter[elPos]) {
                    updateWs = true;
                    break;
                }
            }
        }
        if (updateWs) {
            this.updateWorkspace();
        }
    }

    getList(id: string): List {
        return this.lists.find(l => l.id === id);
    }

    private updateWorkspace() {
        this.logger.log('Updating workspace');

        this.isUpdatingListList = true;

        this.workspace.jsonData = JSON.stringify({
            list: this.listList.map(t => t.id)
        });
        if (this.wssSub) {
            this.wssSub.unsubscribe();
        }
        let ws = {
            jsonData: this.workspace.jsonData
        }
        this.wssSub = this.workspaceService.update(this.workspace.id, ws)
            .pipe(first())
            .subscribe(
                data => {
                    this.logger.log('Saved list order');
                    this.isUpdatingListList = false;
                },
                error => {
                    this.logger.error(error);
                    this.alertService.error(this.i18nService.translate('lists.list.component.error.workspace_update', 'List order could not be saved.'));
                    this.loading = false;
                    this.isUpdatingListList = false;
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
                    this.shortenLsName = 95;
                } else if (result.breakpoints['(min-width: 700px)']) {
                    this.shortenWsName = 65;
                    this.shortenLsName = 70;
                } else if (result.breakpoints['(min-width: 600px)']) {
                    this.shortenWsName = 60;
                    this.shortenLsName = 65;
                } else if (result.breakpoints['(min-width: 500px)']) {
                    this.shortenWsName = 50;
                    this.shortenLsName = 55;
                } else if (result.breakpoints['(min-width: 400px)']) {
                    this.shortenWsName = 40;
                    this.shortenLsName = 45;
                } else if (result.breakpoints['(min-width: 300px)']) {
                    this.shortenWsName = 30;
                    this.shortenLsName = 30;
                } else {
                    this.shortenWsName = 20;
                    this.shortenLsName = 25;
                }
            } else {
                this.shortenWsName = 20;
                this.shortenLsName = 25;
            }
        });
    }

    dropList(event: CdkDragDrop<string[]>) {
        if (event.previousContainer === event.container) {
            moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
        } else {
            transferArrayItem(event.previousContainer.data,
                event.container.data,
                event.previousIndex,
                event.currentIndex);
        }
        this.updateWorkspace();
    }

}

import { Component, OnInit, OnDestroy } from '@angular/core';
import { first } from 'rxjs/operators';
import { faTh, faList, faClock, faSync } from '@fortawesome/free-solid-svg-icons';

import { Todo } from '../_models';
import { LoggerService, UserService, AlertService, I18nService } from '../_services';
import { Subscription } from 'rxjs';

@Component({
    templateUrl: 'list.component.html',
    styleUrls: ['./duetodos.component.scss']
})
export class ListComponent implements OnInit, OnDestroy {
    public loading = false;
    public refreshing = false;
    public error = false;
    public duetodos = [];
    public shortenWsName: number = 15;
    private dueTodosSub: Subscription;
    public faTh = faTh;
    public faList = faList;
    public faClock = faClock;
    public faSync = faSync;

    constructor(
        public i18nService: I18nService,
        private alertService: AlertService,
        private userService: UserService,
        private logger: LoggerService
    ) {
        // Nothing to see here...
    }

    ngOnInit() {
        this.logger.log('Initializing ListComponent (Due Todos)');

        this.loading = true;
        this.refresh();
    }

    ngOnDestroy() {
        this.logger.log('Destroying ListComponent (Due Todos)');

        if (this.dueTodosSub) {
            this.dueTodosSub.unsubscribe();
        }
    }

    refresh() {
        this.logger.log('Refreshing due Todos');

        this.refreshing = true;
        if (this.dueTodosSub) {
            this.dueTodosSub.unsubscribe();
        }
        this.dueTodosSub = this.userService.getDueTodos()
            .pipe(first())
            .subscribe(dueTodos => {
                this.logger.log('Received ' + dueTodos.length + ' due Todos');
                this.duetodos = dueTodos.sort(function (a: Todo, b: Todo) {
                    if (a.dueDate && b.dueDate) {
                        return parseInt(a.dueDate) - parseInt(b.dueDate);
                    }
                    return 0;
                });
                this.loading = false;
                this.refreshing = false;
                this.error = false;
            },
                error => {
                    this.logger.error(error);
                    this.alertService.error(this.i18nService.translate('duetodos.list.component.error.duetodos_load', 'Due Todos could not be loaded.'));
                    this.loading = false;
                    this.refreshing = false;
                    this.error = true;
                });
    }

}

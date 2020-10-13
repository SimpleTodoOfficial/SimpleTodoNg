import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { first } from 'rxjs/operators';

import { List } from '../_models';
import { LoggerService, AlertService, ListService } from '../_services';

@Component({
    selector: 'ngbd-modal-move-todo',
    templateUrl: 'move-todo.modal.html',
    styleUrls: ['./move-todo.modal.scss']
})
export class ModalMoveTodo implements OnInit, OnDestroy {
    public header: string = '';
    public text: string = '';

    public loading = false;
    public lists = [];
    public wsId = '';
    public excludeLsId = '';

    private lssSub: Subscription;

    constructor(
        public modal: NgbActiveModal,
        private alertService: AlertService,
        private listService: ListService,
        private logger: LoggerService
    ) {
        // Nothing to see here...
    }

    ngOnInit() {
        this.logger.log('Initializing ModalMoveTodo');

        this.refresh();
    }

    ngOnDestroy() {
        this.logger.log('Destroying ModalMoveTodo');

        if (this.lssSub) {
            this.lssSub.unsubscribe();
        }
    }

    refresh() {
        this.logger.log('Refreshing lists');

        this.loading = true;

        if (this.lssSub) {
            this.lssSub.unsubscribe();
        }
        this.lssSub = this.listService.getAll(this.wsId)
            .pipe(first())
            .subscribe(lists => {
                this.lists = lists.filter(ws => ws.id !== this.excludeLsId);
                lists.sort(function (a: List, b: List) {
                    return a.name.localeCompare(b.name);
                });
                this.loading = false;
            },
                error => {
                    this.logger.error(error);
                    this.alertService.error('Lists could not be loaded.');
                    this.loading = false;
                    this.modal.dismiss('error');
                });
    }

}

import { Component, OnInit, OnDestroy } from '@angular/core';
import { BreakpointObserver } from '@angular/cdk/layout';
import { Router, ActivatedRoute } from '@angular/router';
import { first } from 'rxjs/operators';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { faCheckSquare, faSquare, faTh, faClipboardList, faTrashAlt, faPlusCircle, faEdit, faList, faListAlt, faRandom } from '@fortawesome/free-solid-svg-icons';

import { ModalConfirm } from '../_modals/confirmation.modal';
import { ModalMoveList } from '../_modals/move-list.modal';
import { LoggerService, ListService, AlertService, I18nService } from '../_services';
import { Subscription } from 'rxjs';

@Component({
    templateUrl: 'details.component.html',
    styleUrls: ['./lists.component.scss']
})
export class DetailsComponent implements OnInit, OnDestroy {
    public loading = false;
    public isDeleting = false;
    public isMoving = false;
    public list = null;
    public wsId: string;
    public id: string;
    public nrTodosToBeDone: number;
    public nrTodosDone: number;
    public shortenWsName: number = 15;
    public shortenLsName: number = 15;
    public shortenLsNameBreadcrumb: number = 15;
    private rtpSub: Subscription;
    private rtppSub: Subscription;
    private lssSub: Subscription;
    private obSub: Subscription;

    public faTh = faTh;
    public faClipboardList = faClipboardList;
    public faTrashAlt = faTrashAlt;
    public faPlusCircle = faPlusCircle;
    public faEdit = faEdit;
    public faList = faList;
    public faListAlt = faListAlt;
    public faSquare = faSquare;
    public faCheckSquare = faCheckSquare;
    public faRandom = faRandom;

    constructor(
        public i18nService: I18nService,
        private observer: BreakpointObserver,
        private router: Router,
        private route: ActivatedRoute,
        private listService: ListService,
        private alertService: AlertService,
        private logger: LoggerService,
        private modalService: NgbModal
    ) {
        this.observerScreenSize();
    }

    ngOnInit() {
        this.rtpSub = this.route.params.subscribe(params => this.init());
    }

    ngOnDestroy() {
        this.logger.log('Destroying DetailsComponent (List)');

        if (this.rtpSub) {
            this.rtpSub.unsubscribe();
        }
        if (this.rtppSub) {
            this.rtppSub.unsubscribe();
        }
        if (this.lssSub) {
            this.lssSub.unsubscribe();
        }
        if (this.obSub) {
            this.obSub.unsubscribe();
        }
    }

    init() {
        this.logger.log('Initializing DetailsComponent (List)');

        this.loading = true;

        if (this.rtppSub) {
            this.rtppSub.unsubscribe();
        }
        this.rtppSub = this.route.parent.params.subscribe(params => {
            this.wsId = params["id"];
            this.id = this.route.snapshot.params['id'];

            if (this.lssSub) {
                this.lssSub.unsubscribe();
            }
            this.lssSub = this.listService.getById(this.wsId, this.id)
                .pipe(first())
                .subscribe(x => {
                    this.list = x;
                    this.nrTodosToBeDone = this.list.todos ? this.list.todos.filter(t => !t.done).length : 0;
                    this.nrTodosDone = this.list.todos ? this.list.todos.filter(t => t.done).length : 0;
                    this.loading = false;
                },
                    error => {
                        this.logger.error(error);
                        this.router.navigate(['/']);
                        this.alertService.error(this.i18nService.translate('lists.details.component.error.list_load', 'List could not be loaded.'));
                    });
        });
    }

    observerScreenSize(): void {
        this.obSub = this.observer.observe([
            '(min-width: 340px)',
            '(min-width: 410px)',
            '(min-width: 510px)',
            '(min-width: 610px)',
            '(min-width: 710px)',
            '(min-width: 810px)'
        ]).subscribe(result => {
            if (result.matches) {
                if (result.breakpoints['(min-width: 810px)']) {
                    this.shortenLsName = 95;
                    this.shortenLsNameBreadcrumb = this.shortenLsName - 20;
                    this.shortenWsName = 15;
                } else if (result.breakpoints['(min-width: 710px)']) {
                    this.shortenLsName = 70;
                    this.shortenLsNameBreadcrumb = this.shortenLsName - 20;
                    this.shortenWsName = 15;
                } else if (result.breakpoints['(min-width: 610px)']) {
                    this.shortenLsName = 65;
                    this.shortenLsNameBreadcrumb = this.shortenLsName - 20;
                    this.shortenWsName = 15;
                } else if (result.breakpoints['(min-width: 510px)']) {
                    this.shortenLsName = 55;
                    this.shortenLsNameBreadcrumb = this.shortenLsName - 20;
                    this.shortenWsName = 15;
                } else if (result.breakpoints['(min-width: 410px)']) {
                    this.shortenLsName = 40;
                    this.shortenLsNameBreadcrumb = this.shortenLsName - 20;
                    this.shortenWsName = 15;
                } else if (result.breakpoints['(min-width: 340px)']) {
                    this.shortenLsName = 30;
                    this.shortenLsNameBreadcrumb = 15;
                    this.shortenWsName = 10;
                } else {
                    this.shortenLsName = 15;
                    this.shortenLsNameBreadcrumb = 15;
                    this.shortenWsName = 10;
                }
            } else {
                this.shortenLsName = 15;
                this.shortenLsNameBreadcrumb = 10;
                this.shortenWsName = 6;
            }
        });
    }

    deleteList(id: string) {
        this.logger.log('Delete list');

        this.isDeleting = true;

        const activeModal = this.modalService.open(ModalConfirm);
        activeModal.componentInstance.header = this.i18nService.translate('lists.details.component.modal.delete.header', 'Confirm list deletion');
        activeModal.componentInstance.text = this.i18nService.translate('lists.details.component.modal.delete.text', 'Are you sure that you want to delete the list "%lsName%"?', { 'lsName': this.list.name });
        activeModal.componentInstance.text2 = this.i18nService.translate('lists.details.component.modal.delete.text2', 'All todos associated to this list will be permanently deleted.');
        activeModal.componentInstance.textDanger = this.i18nService.translate('lists.details.component.modal.delete.textDanger', 'This operation can not be made undone.');
        activeModal.result.then(() => {
            this.logger.log('Deleting list');

            if (this.lssSub) {
                this.lssSub.unsubscribe();
            }
            this.lssSub = this.listService.delete(this.wsId, id)
                .pipe(first())
                .subscribe(() => {
                    this.router.navigate(['/workspaces', this.wsId, 'lists']);
                    this.alertService.info(this.i18nService.translate('lists.details.component.success.list_delete', 'List "%lsName%" deleted.', { 'lsName': this.list.name }), { autoClose: true });
                },
                    error => {
                        this.logger.error(error);
                        this.alertService.error(this.i18nService.translate('lists.details.component.error.list_delete', 'List "%lsName%" could not be deleted.', { 'lsName': this.list.name }));
                        this.isDeleting = false;
                    });
        },
            () => {
                this.logger.log('Canceling list deletion.');
                this.isDeleting = false;
            });
    }

    moveList(id: string) {
        this.logger.log('Moving list');

        this.isMoving = true;

        const activeModalMove = this.modalService.open(ModalMoveList);
        activeModalMove.componentInstance.excludeWsId = this.wsId;
        activeModalMove.componentInstance.header = this.i18nService.translate('lists.details.component.modal.move_select.header', 'Select a workspace');
        activeModalMove.componentInstance.text = this.i18nService.translate('lists.details.component.modal.move_select.text', 'Please select a workspace to move the list "%lsName%" to:', { 'lsName': this.list.name });
        activeModalMove.result.then(ws => {
            this.logger.log('Selected workspace: "' + ws.name + '" (' + ws.id + ')');

            const activeModal = this.modalService.open(ModalConfirm);
            activeModal.componentInstance.header = this.i18nService.translate('lists.details.component.modal.move.header', 'Confirm list movement');
            activeModal.componentInstance.text = this.i18nService.translate('lists.details.component.modal.move.text', 'Are you sure that you want to move the list "%lsName%" to the workspace "%wsName%"?', { 'lsName': this.list.name, 'wsName': ws.name });
            activeModal.componentInstance.text2 = this.i18nService.translate('lists.details.component.modal.move.text2', '');
            activeModal.componentInstance.textDanger = this.i18nService.translate('lists.details.component.modal.move.textDanger', 'All users of the current workspace will not be able to access the list any longer. All users of the new workspace will be granted access to the list.');

            activeModal.result.then(() => {
                this.logger.log('Moving list');

                if (this.lssSub) {
                    this.lssSub.unsubscribe();
                }
                this.lssSub = this.listService.move(this.wsId, id, ws.id)
                    .pipe(first())
                    .subscribe(() => {
                        this.router.navigate(['/workspaces', ws.id, 'lists']);
                        this.alertService.success(this.i18nService.translate('lists.details.component.success.list_move', 'List successfully moved.'), { autoClose: true });
                    },
                    error => {
                        this.logger.error(error);
                        this.alertService.error(this.i18nService.translate('lists.details.component.error.list_move', 'The list could not be moved.'));
                        this.isMoving = false;
                    });
            },
                () => {
                    this.logger.log('Canceling moving list.');
                    this.isMoving = false;
                });
        },
            () => {
                this.logger.log('Canceling moving list.');
                this.isMoving = false;
            });
    }

}

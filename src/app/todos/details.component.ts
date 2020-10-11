import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { BreakpointObserver } from '@angular/cdk/layout';
import { first } from 'rxjs/operators';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { faCheckSquare, faSquare, faTh, faClipboardList, faList, faPlusCircle, faEdit, faItalic, faTrashAlt, faRandom } from '@fortawesome/free-solid-svg-icons';

import { ModalConfirm } from '../_modals/confirmation.modal';
import { ModalMoveTodo } from '../_modals/move-todo.modal';
import { LoggerService, TodoService, AlertService } from '../_services';
import { Subscription } from 'rxjs';

@Component({
    templateUrl: 'details.component.html',
    styleUrls: ['./todos.component.scss']
})
export class DetailsComponent implements OnInit, OnDestroy {
    public loading = false;
    public isDeleting = false;
    public isMoving = false;
    public todo = null;
    public shortenWsName: number = 15;
    public shortenLsNameBreadcrumb: number = 15;
    public wsId: string;
    public lsId: string;
    public id: string;
    private rtSub: Subscription;
    private wsSub: Subscription;
    private lsSub: Subscription;
    private tdsSub: Subscription;
    private obSub: Subscription;

    public faTh = faTh;
    public faClipboardList = faClipboardList;
    public faList = faList;
    public faPlusCircle = faPlusCircle;
    public faEdit = faEdit;
    public faItalic = faItalic;
    public faTrashAlt = faTrashAlt;
    public faSquare = faSquare;
    public faCheckSquare = faCheckSquare;
    public faRandom = faRandom;

    constructor(
        private observer: BreakpointObserver,
        private router: Router,
        private route: ActivatedRoute,
        private todoService: TodoService,
        private alertService: AlertService,
        private logger: LoggerService,
        private modalService: NgbModal
    ) {
        this.observerScreenSize();
    }

    ngOnInit() {
        this.rtSub = this.route.params.subscribe(params => this.init());
    }

    ngOnDestroy() {
        this.logger.log('Destroying DetailsComponent (Todo)');

        if (this.rtSub) {
            this.rtSub.unsubscribe();
        }
        if (this.wsSub) {
            this.wsSub.unsubscribe();
        }
        if (this.lsSub) {
            this.lsSub.unsubscribe();
        }
        if (this.tdsSub) {
            this.tdsSub.unsubscribe();
        }
        if (this.obSub) {
            this.obSub.unsubscribe();
        }
    }

    init() {
        this.logger.log('Initializing DetailsComponent (Todo)');
        this.loading = true;

        if (this.wsSub) {
            this.wsSub.unsubscribe();
        }
        this.wsSub = this.route.parent.parent.parent.params.subscribe(paramsWs => {
            this.wsId = paramsWs["id"];

            if (this.lsSub) {
                this.lsSub.unsubscribe();
            }
            this.lsSub = this.route.parent.parent.params.subscribe(paramsLs => {
                this.lsId = paramsLs["id"];
                this.id = this.route.snapshot.params['id'];

                if (this.tdsSub) {
                    this.tdsSub.unsubscribe();
                }
                this.tdsSub = this.todoService.getById(this.wsId, this.lsId, this.id)
                    .pipe(first())
                    .subscribe(x => {
                        this.todo = x;
                        this.loading = false;
                    },
                        error => {
                            this.logger.error(error);
                            this.router.navigate(['/']);
                            this.alertService.error('Todo could not be loaded.');
                        });
            });
        });
    }

    observerScreenSize(): void {
        this.obSub = this.observer.observe([
            '(min-width: 300px)',
            '(min-width: 400px)',
            '(min-width: 520px)',
            '(min-width: 500px)',
            '(min-width: 600px)',
            '(min-width: 800px)'
        ]).subscribe(result => {
            if (result.matches) {
                if (result.breakpoints['(min-width: 800px)']) {
                    this.shortenLsNameBreadcrumb = 70;
                    this.shortenWsName = 15;
                } else if (result.breakpoints['(min-width: 600px)']) {
                    this.shortenLsNameBreadcrumb = 45;
                    this.shortenWsName = 15;
                } else if (result.breakpoints['(min-width: 500px)']) {
                    this.shortenLsNameBreadcrumb = 35;
                    this.shortenWsName = 15;
                } else if (result.breakpoints['(min-width: 400px)']) {
                    this.shortenLsNameBreadcrumb = 20;
                    this.shortenWsName = 15;
                } else if (result.breakpoints['(min-width: 300px)']) {
                    this.shortenLsNameBreadcrumb = 12;
                    this.shortenWsName = 10;
                } else {
                    this.shortenLsNameBreadcrumb = 12;
                    this.shortenWsName = 10;
                }
            } else {
                this.shortenLsNameBreadcrumb = 10;
                this.shortenWsName = 6;
            }
        });
    }

    deleteTodo(id: string) {
        this.logger.log('Deleting todo');

        this.isDeleting = true;

        if (this.tdsSub) {
            this.tdsSub.unsubscribe();
        }
        this.tdsSub = this.todoService.delete(this.wsId, this.lsId, id)
            .subscribe(
                () => {
                    this.router.navigate(['/workspaces', this.wsId, 'lists', this.lsId, 'todos']);
                    // this.alertService.success('Todo successfully deleted.', { autoClose: true });
                },
                error => {
                    this.logger.error(error);
                    this.alertService.error('Todo could not be deleted.');
                    this.isDeleting = false;
                });
    }

    moveTodo(id: string) {
        this.logger.log('Moving todo');

        this.isMoving = true;

        const activeModalMove = this.modalService.open(ModalMoveTodo);
        activeModalMove.componentInstance.wsId = this.wsId;
        activeModalMove.componentInstance.excludeLsId = this.lsId;
        activeModalMove.componentInstance.text = 'Please select a list to move the todo to:';
        activeModalMove.result.then(ls => {
            this.logger.log('Selected list: "' + ls.name + '" (' + ls.id + ')');

            const activeModal = this.modalService.open(ModalConfirm);
            activeModal.componentInstance.header = 'Confirm moving todo';
            activeModal.componentInstance.text = 'Are you sure that you want to move the todo to the list "' + ls.name + '"?';
            activeModal.componentInstance.text2 = '';
            activeModal.componentInstance.textDanger = '';
            activeModal.result.then(() => {
                this.logger.log('Moving todo');

                if (this.tdsSub) {
                    this.tdsSub.unsubscribe();
                }
                this.tdsSub = this.todoService.move(this.wsId, this.lsId, id, ls.id)
                    .pipe(first())
                    .subscribe(() => {
                        this.router.navigate(['/workspaces', this.wsId, 'lists', ls.id, 'todos']);
                        this.alertService.success('Todo successfully moved.', { autoClose: true });
                    });
            },
                () => {
                    this.logger.log('Canceling moving todo.');
                    this.isMoving = false;
                });
        },
            () => {
                this.logger.log('Canceling moving todo.');
                this.isMoving = false;
            });
    }

}

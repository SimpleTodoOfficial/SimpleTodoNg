import { Component, OnInit, OnDestroy } from '@angular/core';
import { BreakpointObserver } from '@angular/cdk/layout';
import { Router, ActivatedRoute } from '@angular/router';
import { first } from 'rxjs/operators';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { faCheckSquare, faSquare, faTh, faClipboardList, faTrashAlt, faPlusCircle, faEdit, faList, faListAlt } from '@fortawesome/free-solid-svg-icons';

import { ModalConfirm } from '../_modals/confirmation.modal';
import { LoggerService, ListService, AlertService } from '../_services';
import { Subscription } from 'rxjs';

@Component({
    templateUrl: 'details.component.html',
    styleUrls: ['./lists.component.scss']
})
export class DetailsComponent implements OnInit, OnDestroy {
    public loading = false;
    public isDeleting = false;
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

    constructor(
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
                        this.alertService.error('List could not be loaded.');
                    });
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
                    this.shortenLsName = 95;
                    this.shortenLsNameBreadcrumb = this.shortenLsName - 20;
                    this.shortenWsName = 15;
                } else if (result.breakpoints['(min-width: 700px)']) {
                    this.shortenLsName = 70;
                    this.shortenLsNameBreadcrumb = this.shortenLsName - 20;
                    this.shortenWsName = 15;
                } else if (result.breakpoints['(min-width: 600px)']) {
                    this.shortenLsName = 65;
                    this.shortenLsNameBreadcrumb = this.shortenLsName - 20;
                    this.shortenWsName = 15;
                } else if (result.breakpoints['(min-width: 500px)']) {
                    this.shortenLsName = 55;
                    this.shortenLsNameBreadcrumb = this.shortenLsName - 20;
                    this.shortenWsName = 15;
                } else if (result.breakpoints['(min-width: 400px)']) {
                    this.shortenLsName = 40;
                    this.shortenLsNameBreadcrumb = this.shortenLsName - 20;
                    this.shortenWsName = 15;
                } else if (result.breakpoints['(min-width: 300px)']) {
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
        activeModal.componentInstance.header = 'Confirm list deletion';
        activeModal.componentInstance.text = 'Are you sure that you want to delete the list "' + this.list.name + '"?';
        activeModal.componentInstance.text2 = 'All todos associated to this list will be permanently deleted.';
        activeModal.result.then(() => {
            this.logger.log('Deleting list');

            if (this.lssSub) {
                this.lssSub.unsubscribe();
            }
            this.lssSub = this.listService.delete(this.wsId, id)
                .pipe(first())
                .subscribe(() => {
                    this.router.navigate(['/workspaces', this.wsId, 'lists']);
                    this.alertService.success('List successfully deleted.', { autoClose: true });
                });
        },
            () => {
                this.logger.log('Canceling list deletion.');
                this.isDeleting = false;
            });
    }

}

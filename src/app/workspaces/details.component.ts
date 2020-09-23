import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { BreakpointObserver } from '@angular/cdk/layout';
import { first } from 'rxjs/operators';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { faTh, faDiceD6, faTrashAlt, faUserCircle, faPlusCircle, faUser, faEdit, faClipboardList } from '@fortawesome/free-solid-svg-icons';

import { ModalConfirm } from '../_modals/confirmation.modal';
import { LoggerService, AlertService, WorkspaceService, UserService } from '../_services';
import { User } from '../_models/user.model';

@Component({
    templateUrl: 'details.component.html',
    styleUrls: ['./workspaces.component.scss']
})
export class DetailsComponent implements OnInit, OnDestroy {
    public loading = false;
    public deletingWorkspace = false;
    public deletingUser = false;
    public usersLoading = false;
    public workspace = null;
    public shortenUsername: number = 12;
    public shortenWsName: number = 15;
    public filteredUsers: User[] = [];
    public id: string;
    private allUsers: User[] = [];
    private rtSub: Subscription;
    private wssSub: Subscription;
    private ussSub: Subscription;
    private obSub: Subscription;

    public faTh = faTh;
    public faDiceD6 = faDiceD6;
    public faTrashAlt = faTrashAlt;
    public faUserCircle = faUserCircle;
    public faUser = faUser;
    public faPlusCircle = faPlusCircle;
    public faEdit = faEdit;
    public faClipboardList = faClipboardList;

    constructor(
        private observer: BreakpointObserver,
        private router: Router,
        private route: ActivatedRoute,
        private alertService: AlertService,
        private workspaceService: WorkspaceService,
        private userService: UserService,
        private logger: LoggerService,
        private modalService: NgbModal
    ) {
        // Nothing to see here...
    }

    ngOnInit() {
        this.rtSub = this.route.params.subscribe(params => this.init());

        this.observerScreenSize();
    }

    ngOnDestroy() {
        this.logger.log('Destroying DetailsComponent (Workspace)');

        if (this.rtSub) {
            this.rtSub.unsubscribe();
        }
        if (this.wssSub) {
            this.wssSub.unsubscribe();
        }
        if (this.ussSub) {
            this.ussSub.unsubscribe();
        }
        if (this.obSub) {
            this.obSub.unsubscribe();
        }
    }

    init() {
        this.logger.log('Initializing DetailsComponent (Workspace)');

        this.loading = true;
        this.usersLoading = true;

        this.id = this.route.snapshot.params['id'];

        if (this.wssSub) {
            this.wssSub.unsubscribe();
        }
        this.wssSub = this.workspaceService.getById(this.id)
            .pipe(first())
            .subscribe(x => {
                this.workspace = x;
                this.loading = false;

                if (this.ussSub) {
                    this.ussSub.unsubscribe();
                }
                this.ussSub = this.userService.getAll()
                    .pipe(first())
                    .subscribe(users => {
                        this.allUsers = users;
                        this.updatedFilteredUsers(this.allUsers);
                        this.usersLoading = false;
                    },
                        error => {
                            this.logger.error(error);
                            this.router.navigate(['/']);
                            this.alertService.error('Users could not be loaded.');
                        });
            },
                error => {
                    this.logger.error(error);
                    this.router.navigate(['/']);
                    this.alertService.error('Workspace could not be loaded.');
                });
    }

    updatedFilteredUsers(users: User[]): void {
        this.filteredUsers = users.filter(u => !this.workspace.users.map(wss => wss.id).includes(u.id));
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
                    this.shortenWsName = 85;
                } else if (result.breakpoints['(min-width: 700px)']) {
                    this.shortenWsName = 60;
                } else if (result.breakpoints['(min-width: 600px)']) {
                    this.shortenWsName = 60;
                } else if (result.breakpoints['(min-width: 500px)']) {
                    this.shortenWsName = 50;
                } else if (result.breakpoints['(min-width: 400px)']) {
                    this.shortenWsName = 40;
                } else if (result.breakpoints['(min-width: 300px)']) {
                    this.shortenWsName = 23;
                } else {
                    this.shortenWsName = 20;
                }
            } else {
                this.shortenWsName = 20;
            }
        });
    }

    deleteWorkspace(id: string) {
        this.logger.log('Delete workspace.');

        this.deletingWorkspace = true;

        const activeModal = this.modalService.open(ModalConfirm);
        activeModal.componentInstance.header = 'Confirm workspace deletion';
        activeModal.componentInstance.text = 'Are you sure that you want to delete the workspace "' + this.workspace.name + '"?';
        activeModal.componentInstance.text2 = 'All lists and todos associated to this workspace will be permanently deleted.';
        activeModal.result.then(() => {
            this.logger.log('Deleting workspace.');

            let wsName = this.workspace.name;
            if (this.wssSub) {
                this.wssSub.unsubscribe();
            }
            this.wssSub = this.workspaceService.delete(id)
                .pipe(first())
                .subscribe(() => {
                    this.logger.log('Workspace deleted');
                    this.router.navigate(['/workspaces']);
                    this.alertService.info('Workspace "' + wsName + '" deleted.', { autoClose: true });
                },
                    error => {
                        this.logger.error(error);
                        this.alertService.error('Workspace "' + wsName + '" could not be deleted.');
                        this.deletingWorkspace = false;
                    });
        },
            () => {
                this.logger.log('Canceling workspace deletion.');
                this.deletingWorkspace = false;
            });
    }

    addUser(userId: string) {
        this.logger.log('Adding user');

        this.workspace.users = this.workspace.users.map(u => u.id);
        this.workspace.users.push(userId)
        if (this.wssSub) {
            this.wssSub.unsubscribe();
        }
        this.wssSub = this.workspaceService.update(this.id, this.workspace)
            .pipe(first())
            .subscribe(
                data => {
                    this.logger.log('Added user to workspace');
                    this.workspace = data;
                    this.updatedFilteredUsers(this.allUsers);
                    this.alertService.info('Added user to workspace.', { autoClose: true });
                },
                error => {
                    this.logger.log('The user could not be added to the workspace');
                    this.logger.error(error);
                    this.alertService.error('The user could not be added to the workspace.');
                });
    }

    removeUser(event, userId: string, userName: string) {
        this.logger.log('Removing user from workspace');
        event.stopPropagation();

        this.deletingUser = true;

        const activeModal = this.modalService.open(ModalConfirm);
        activeModal.componentInstance.header = 'Confirm user removal from workspace';
        activeModal.componentInstance.text = 'Are you sure that you want to remove the user "' + userName + '" from the workspace "' + this.workspace.name + '"?';
        activeModal.componentInstance.text2 = 'The user will not have any access to lists or todos in this workspace any more.';
        activeModal.componentInstance.textDanger = '';
        activeModal.result.then(() => {
            this.logger.log('Removing user from workspace.');

            this.workspace.users = this.workspace.users.map(u => u.id).filter(uId => uId !== userId);
            if (this.wssSub) {
                this.wssSub.unsubscribe();
            }
            this.wssSub = this.workspaceService.update(this.id, this.workspace)
                .pipe(first())
                .subscribe(
                    data => {
                        this.logger.log('Removed user from workspace');
                        this.workspace = data;
                        if (this.userService.userValue.id === userId) {
                            this.router.navigate(['/workspaces']);
                        } else {
                            this.updatedFilteredUsers(this.allUsers);
                            this.deletingUser = false;
                        }
                        this.alertService.info('Removed user from workspace.', { autoClose: true });
                    },
                    error => {
                        this.logger.error(error);
                        this.alertService.error('The user could not be removed from the workspace.');
                        this.deletingUser = false;
                    });
        },
            () => {
                this.logger.log('Canceling workspace deletion.');
                this.deletingUser = false;
            });
    }

}

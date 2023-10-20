﻿import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { BreakpointObserver } from '@angular/cdk/layout';
import { first } from 'rxjs/operators';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { faTriangleExclamation, faTh, faDiceD6, faTrashAlt, faUserCircle, faPlusCircle, faUser, faEdit, faClipboardList } from '@fortawesome/free-solid-svg-icons';

import { ModalConfirm } from '../_modals/confirmation.modal';
import { LoggerService, AlertService, WorkspaceService, UserService, I18nService } from '../_services';
import { User } from '../_models/user.model';

@Component({
    templateUrl: 'details.component.html',
    styleUrls: ['./workspaces.component.scss']
})
export class DetailsComponent implements OnInit, OnDestroy {
    public loading = false;
    public deletingWorkspace = false;
    public usersLoading = false;
    public workspace = null;
    public shortenUsername: number = 12;
    public shortenWsName: number = 15;
    public filteredUsers: User[] = [];
    public id: string;
    public userIdToBeDeleted: String;
    private allUsers: User[] = [];
    private rtSub: Subscription;
    private wssSub: Subscription;
    private ussSub: Subscription;
    private obSub: Subscription;

    public faTriangleExclamation = faTriangleExclamation;
    public faTh = faTh;
    public faDiceD6 = faDiceD6;
    public faTrashAlt = faTrashAlt;
    public faUserCircle = faUserCircle;
    public faUser = faUser;
    public faPlusCircle = faPlusCircle;
    public faEdit = faEdit;
    public faClipboardList = faClipboardList;

    constructor(
        public i18nService: I18nService,
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
        this.rtSub = this.route.params.subscribe(_ => this.init());

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
            .subscribe({
                next: x => {
                    this.workspace = x;
                    this.loading = false;

                    if (this.ussSub) {
                        this.ussSub.unsubscribe();
                    }
                    this.ussSub = this.userService.getAll()
                        .pipe(first())
                        .subscribe({
                            next: users => {
                                this.allUsers = users;
                                this.updatedFilteredUsers(this.allUsers);
                                this.usersLoading = false;
                            },
                            error: error => {
                                this.logger.error(error);
                                this.router.navigate(['/']);
                                this.alertService.error(this.i18nService.translate('workspaces.details.component.error.users_load', 'Users could not be loaded.'));
                            }
                        });
                },
                error: error => {
                    this.logger.error(error);
                    this.router.navigate(['/']);
                    this.alertService.error(this.i18nService.translate('workspaces.details.component.error.workspace_load', 'Workspace could not be loaded.'));
                }
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
        activeModal.componentInstance.header = this.i18nService.translate('workspaces.details.component.modal.delete.header', 'Confirm workspace deletion');
        activeModal.componentInstance.text = this.i18nService.translate('workspaces.details.component.modal.delete.text', 'Are you sure that you want to delete the workspace "%wsName%"?', {'wsName': this.workspace.name});
        activeModal.componentInstance.text2 = this.i18nService.translate('workspaces.details.component.modal.delete.text2', 'All lists and todos associated to this workspace will be permanently deleted.');
        activeModal.componentInstance.textDanger = this.i18nService.translate('workspaces.details.component.modal.delete.textDanger', 'This operation can not be made undone.');
        activeModal.result.then(() => {
            this.logger.log('Deleting workspace.');

            if (this.wssSub) {
                this.wssSub.unsubscribe();
            }
            this.wssSub = this.workspaceService.delete(id)
                .pipe(first())
                .subscribe({
                    next: () => {
                        this.logger.log('Workspace deleted');
                        this.router.navigate(['/workspaces']);
                        this.alertService.info(this.i18nService.translate('workspaces.details.component.success.workspace_delete', 'Workspace "%wsName%" deleted.', {'wsName': this.workspace.name}));
                    },
                    error: error => {
                        this.logger.error(error);
                        this.alertService.error(this.i18nService.translate('workspaces.details.component.error.workspace_delete', 'Workspace "%wsName%" could not be deleted.', {'wsName': this.workspace.name}));
                        this.deletingWorkspace = false;
                    }
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
            .subscribe({
                next: data => {
                    this.logger.log('Added user to workspace');
                    this.workspace = data;
                    this.updatedFilteredUsers(this.allUsers);
                    this.alertService.info(this.i18nService.translate('workspaces.details.component.success.user_add', 'Added user to workspace.'));
                },
                error: error => {
                    this.logger.error('The user could not be added to the workspace');
                    this.logger.error(error);
                    this.alertService.error(this.i18nService.translate('workspaces.details.component.error.user_add', 'The user could not be added to the workspace.'));
                }
            });
    }

    removeUser(event, userId: string, userName: string) {
        this.logger.log('Removing user from workspace');
        event.stopPropagation();

        this.userIdToBeDeleted = userId;

        const activeModal = this.modalService.open(ModalConfirm);
        activeModal.componentInstance.header = this.i18nService.translate('workspaces.details.component.modal.remove_user.header', 'Confirm user removal from workspace');
        activeModal.componentInstance.text = this.i18nService.translate('workspaces.details.component.modal.remove_user.text', 'Are you sure that you want to remove the user "%userName%" from the workspace "%wsName%"?', {'userName': userName, 'wsName': this.workspace.name});
        activeModal.componentInstance.text2 = this.i18nService.translate('workspaces.details.component.modal.remove_user.text2', 'The user will not have any access to lists or todos in this workspace any more.');
        activeModal.componentInstance.textDanger = this.i18nService.translate('workspaces.details.component.modal.remove_user.textDanger', '');
        activeModal.result.then(() => {
            this.logger.log('Removing user from workspace.');

            this.workspace.users = this.workspace.users.map(u => u.id).filter(uId => uId !== userId);
            if (this.wssSub) {
                this.wssSub.unsubscribe();
            }
            this.wssSub = this.workspaceService.update(this.id, this.workspace)
                .pipe(first())
                .subscribe({
                    next: data => {
                        this.logger.log('Removed user from workspace');
                        this.workspace = data;
                        if (this.userService.userValue.id === userId) {
                            this.router.navigate(['/workspaces']);
                        } else {
                            this.updatedFilteredUsers(this.allUsers);
                            this.userIdToBeDeleted = '';
                        }
                        this.alertService.info(this.i18nService.translate('workspaces.details.component.success.user_remove', 'Removed user from workspace.'));
                    },
                    error: error => {
                        this.logger.error(error);
                        this.alertService.error(this.i18nService.translate('workspaces.details.component.error.user_remove', 'The user could not be removed from the workspace.'));
                        this.userIdToBeDeleted = '';
                    }
                });
        },
            () => {
                this.logger.log('Canceling workspace deletion.');
                this.userIdToBeDeleted = '';
            });
    }

}

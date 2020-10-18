import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BreakpointObserver } from '@angular/cdk/layout';
import { first } from 'rxjs/operators';
import { faTrashAlt, faUserCircle, faUser, faPlusCircle, faEdit, faUserTag } from '@fortawesome/free-solid-svg-icons';

import { ModalConfirm } from '../_modals/confirmation.modal';
import { UserRole } from '../_models';
import { LoggerService, AlertService, UserService, I18nService } from '../_services';
import { Subscription } from 'rxjs';

@Component({
    templateUrl: 'details.component.html',
    styleUrls: ['./users.component.scss']
})
export class DetailsComponent implements OnInit, OnDestroy {
    public loading = false;
    public isDeleting = false;
    public isDeletingRole = false;
    public user = null;
    public isAdmin: boolean;
    public canEditOrDelete: boolean;
    public userRoles: UserRole[] = [];
    public shortenUName: number = 25;
    public shortenUNameDetails: number = 25;
    private id: string;
    private rtSub: Subscription;
    private usSub: Subscription;
    private obSub: Subscription;

    public faTrashAlt = faTrashAlt;
    public faUserCircle = faUserCircle;
    public faUser = faUser;
    public faPlusCircle = faPlusCircle;
    public faEdit = faEdit;
    public faUserTag = faUserTag;

    constructor(
        public i18nService: I18nService,
        private observer: BreakpointObserver,
        private router: Router,
        private route: ActivatedRoute,
        private userService: UserService,
        private logger: LoggerService,
        private alertService: AlertService,
        private modalService: NgbModal
    ) {
        this.observerScreenSize();
    }

    ngOnInit() {
        this.rtSub = this.route.params.subscribe(params => this.init());
    }

    ngOnDestroy() {
        this.logger.log('Destroying DetailsComponent (User)');

        if (this.rtSub) {
            this.rtSub.unsubscribe();
        }
        if (this.usSub) {
            this.usSub.unsubscribe();
        }
        if (this.rtSub) {
            this.rtSub.unsubscribe();
        }
        if (this.obSub) {
            this.obSub.unsubscribe();
        }
    }

    init() {
        this.logger.log('Initializing DetailsComponent (User)');

        this.loading = true;

        this.id = this.route.snapshot.params['id'];
        this.isAdmin = this.userService.isAdmin();
        this.canEditOrDelete = this.userService.userValue && this.id == this.userService.userValue.id || this.isAdmin;

        if (this.usSub) {
            this.usSub.unsubscribe();
        }
        this.usSub = this.userService.getById(this.id)
            .pipe(first())
            .subscribe(x => {
                this.user = x;
                this.refreshStatus();
                this.loading = false;
            },
                error => {
                    this.logger.error(error);
                    this.router.navigate(['/users']);
                    this.alertService.error(this.i18nService.translate('users.details.component.error.user_load', 'User could not be loaded.'));
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
                    this.shortenUName = 90;
                    this.shortenUNameDetails = this.shortenUName - 5;
                } else if (result.breakpoints['(min-width: 700px)']) {
                    this.shortenUName = 70;
                    this.shortenUNameDetails = this.shortenUName - 5;
                } else if (result.breakpoints['(min-width: 600px)']) {
                    this.shortenUName = 65;
                    this.shortenUNameDetails = this.shortenUName - 5;
                } else if (result.breakpoints['(min-width: 500px)']) {
                    this.shortenUName = 55;
                    this.shortenUNameDetails = this.shortenUName - 5;
                } else if (result.breakpoints['(min-width: 400px)']) {
                    this.shortenUName = 45;
                    this.shortenUNameDetails = this.shortenUName - 5;
                } else if (result.breakpoints['(min-width: 300px)']) {
                    this.shortenUName = 32;
                    this.shortenUNameDetails = this.shortenUName - 5;
                } else {
                    this.shortenUName = 25;
                    this.shortenUNameDetails = this.shortenUName - 5;
                }
            } else {
                this.shortenUName = 25;
                this.shortenUNameDetails = this.shortenUName - 5;
            }
        });
    }

    refreshStatus(): void {
        if (this.user.roles && !this.user.roles.includes("ADMIN")) {
            this.userRoles = [UserRole.ADMIN]
        } else {
            this.userRoles = []
        }
    }

    deleteUser(id: string) {
        this.logger.log('Delete user');

        this.isDeleting = true;

        const activeModal = this.modalService.open(ModalConfirm);
        activeModal.componentInstance.header = this.i18nService.translate('users.details.component.modal.delete.header', 'Confirm user deletion');
        activeModal.componentInstance.text = this.i18nService.translate('users.details.component.modal.delete.text', 'Are you sure that you want to delete the user "%username%"?', { 'username': this.user.username });
        activeModal.componentInstance.text2 = this.i18nService.translate('users.details.component.modal.delete.text2', '');
        activeModal.componentInstance.textDanger = this.i18nService.translate('users.details.component.modal.delete.textDanger', 'Everything associated to this user will be permanently deleted.');
        activeModal.result.then(() => {
            this.logger.log('Deleting user');

            if (this.usSub) {
                this.usSub.unsubscribe();
            }
            this.usSub = this.userService.delete(id)
                .pipe(first())
                .subscribe(x => {
                    if (x != null) {
                        this.router.navigate(['/users']);
                        this.alertService.success(this.i18nService.translate('users.details.component.success.user_delete', 'User successfully deleted.'), { autoClose: true });
                    }
                },
                    error => {
                        this.logger.error(error);
                        this.alertService.error(this.i18nService.translate('users.details.component.error.user_delete', 'User could not be deleted. Possible reasons: For example, there has to be at least one user with role "Administrator".'));
                        this.isDeleting = false;
                    });
        },
            () => {
                this.logger.log('Canceling user deletion.');
                this.isDeleting = false;
            });
    }

    addRole(role: UserRole): void {
        this.logger.log('Adding user role');

        this.user.roles.push(role);

        if (this.usSub) {
            this.usSub.unsubscribe();
        }
        this.usSub = this.userService.update(this.id, this.user)
            .pipe(first())
            .subscribe(
                data => {
                    this.logger.log('Adding role to user');
                    this.refreshStatus();
                    this.alertService.info(this.i18nService.translate('users.details.component.success.role_add', 'Added role to user.'), { autoClose: true });
                },
                error => {
                    this.logger.error(error);
                    this.alertService.error(this.i18nService.translate('users.details.component.error.role_add', 'Could not add role to user.'));
                });
    }

    removeRole(role: UserRole): void {
        this.logger.log('Removing user role');

        this.isDeletingRole = true;

        const activeModal = this.modalService.open(ModalConfirm);
        activeModal.componentInstance.header = this.i18nService.translate('users.details.component.modal.remove_role.header', 'Confirm user role removal');
        let rolename = this.i18nService.translate('app.roles.' + role, role);
        activeModal.componentInstance.text = this.i18nService.translate('users.details.component.modal.remove_role.text', 'Are you sure that you want to remove the user role "%rolename%" from this user?', { 'rolename': rolename });
        activeModal.componentInstance.text2 = this.i18nService.translate('users.details.component.modal.remove_role.text2', '');
        activeModal.componentInstance.textDanger = this.i18nService.translate('users.details.component.modal.remove_role.textDanger', '');
        activeModal.result.then(() => {
            this.logger.log('Removing user role.');

            this.user.roles = this.user.roles.filter(r => r !== role);

            if (this.usSub) {
                this.usSub.unsubscribe();
            }
            this.usSub = this.userService.update(this.id, this.user)
                .pipe(first())
                .subscribe(
                    data => {
                        this.logger.log('Removed role from user');
                        this.refreshStatus();
                        this.alertService.info(this.i18nService.translate('users.details.component.success.role_remove', 'Removed role from user.'), { autoClose: true });
                        this.isDeletingRole = false;
                    },
                    error => {
                        this.logger.error(error);
                        this.alertService.error(this.i18nService.translate('users.details.component.error.role_remove', 'Could not remove role from user.'));
                        this.isDeletingRole = false;
                    });
        },
            () => {
                this.logger.log('Canceling user role removal.');
                this.isDeletingRole = false;
            });
    }

}

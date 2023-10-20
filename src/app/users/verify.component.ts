import { Component, OnInit, OnDestroy, AfterViewInit, ElementRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';

import { ModalConfirm } from '../_modals/confirmation.modal';
import { LoggerService, UserService, AlertService, I18nService } from '../_services';
import { Subscription } from 'rxjs';

@Component({
    templateUrl: 'verify.component.html',
    styleUrls: ['./users.component.scss']
})
export class VerifyComponent implements OnInit, OnDestroy, AfterViewInit {
    public form: FormGroup;
    public loading = false;
    public submitted = false;
    public id: string;
    private rtSub: Subscription;
    private verifySub: Subscription;
    private resendSub: Subscription;

    private AUTOFOCUS_DELAY_MS = 100;

    constructor(
        public i18nService: I18nService,
        private elementRef: ElementRef,
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private userService: UserService,
        private alertService: AlertService,
        private logger: LoggerService,
        private modalService: NgbModal
    ) {
        // Nothing to see here...
    }

    ngOnInit() {
        this.rtSub = this.route.params.subscribe(_ => this.init());
    }

    ngOnDestroy() {
        this.logger.log('Destroying VerifyComponent');

        if (this.rtSub) {
            this.rtSub.unsubscribe();
        }
        if (this.verifySub) {
            this.verifySub.unsubscribe();
        }
        if (this.resendSub) {
            this.resendSub.unsubscribe();
        }
    }

    ngAfterViewInit() {
        setTimeout(() => this.autofocus(), this.AUTOFOCUS_DELAY_MS);
    }

    autofocus() {
        var el = this.elementRef.nativeElement.querySelector('#autofocus');
        if (el != null) {
            el.focus();
        }
    }

    init() {
        this.logger.log('Initializing VerifyComponent');

        this.form = this.formBuilder.group({
            token: ['', Validators.required]
        });

        this.loading = false;
    }

    get f() {
        return this.form.controls;
    }

    onSubmit() {
        this.loading = true;
        this.submitted = true;

        this.alertService.clearAll();

        if (this.form.invalid) {
            this.loading = false;
            return;
        }

        if (this.verifySub) {
            this.verifySub.unsubscribe();
        }
        this.verifySub = this.userService.verify(this.f.token.value)
            .pipe(first())
            .subscribe({
                next: _ => {
                    this.logger.log('Successfully verified user. Please sign in again.');

                    this.router.navigate(['/']);
                    this.alertService.success(this.i18nService.translate('users.verify.component.success.verify', 'Successfully verified user. Please sign in again.'), { autoClose: false });
                },
                error: error => {
                    this.logger.error(error);
                    this.alertService.error(this.i18nService.translate('users.verify.component.error.verify', 'User could not be verified. Please double-check your token.'));
                    this.loading = false;
                }
            });
    }

    resendVerification() {
        this.loading = true;
        this.alertService.clearAll();

        const activeModal = this.modalService.open(ModalConfirm);
        activeModal.componentInstance.header = this.i18nService.translate('users.verify.component.modal.remove_role.header', 'Confirm resending verification');
        activeModal.componentInstance.text = this.i18nService.translate('users.verify.component.modal.remove_role.text', 'Are you sure that you want to resend the email verification?');
        activeModal.componentInstance.text2 = this.i18nService.translate('users.verify.component.modal.remove_role.text2', 'An email with a new token will be sent to your email address.');
        activeModal.componentInstance.textDanger = this.i18nService.translate('users.verify.component.modal.remove_role.textDanger', '');

        activeModal.result.then(() => {
            this.logger.log('Resending verification');

            if (this.resendSub) {
                this.resendSub.unsubscribe();
            }
            this.verifySub = this.userService.resendVerification()
                .pipe(first())
                .subscribe({
                    next: _ => {
                        this.logger.log('Successfully resent verification. Please check your emails.');

                        this.alertService.success(this.i18nService.translate('users.verify.component.success.resend', 'Successfully resent verification. Please check your emails.'));
                        this.loading = false;
                    },
                    error: error => {
                        this.logger.error(error);
                        this.alertService.error(this.i18nService.translate('users.verify.component.error.resend', 'Verification could not be resend.'));
                        this.loading = false;
                    }
                });
        },
            () => {
                this.logger.log('Canceling resending verification.');
                this.loading = false;
            });
    }

}

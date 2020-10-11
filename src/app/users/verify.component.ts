import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';

import { ModalConfirm } from '../_modals/confirmation.modal';
import { LoggerService, UserService, AlertService } from '../_services';
import { Subscription } from 'rxjs';

@Component({
    templateUrl: 'verify.component.html',
    styleUrls: ['./users.component.scss']
})
export class VerifyComponent implements OnInit, OnDestroy {
    public form: FormGroup;
    public loading = false;
    public submitted = false;
    public id: string;
    private rtSub: Subscription;
    private verifySub: Subscription;
    private resendSub: Subscription;

    constructor(
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
        this.rtSub = this.route.params.subscribe(params => this.init());
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

        this.alertService.clear();

        if (this.form.invalid) {
            this.loading = false;
            return;
        }

        if (this.verifySub) {
            this.verifySub.unsubscribe();
        }
        this.verifySub = this.userService.verify(this.f.token.value)
            .pipe(first())
            .subscribe(
                data => {
                    this.logger.log('Successfully verified user. Please sign in again.');

                    this.router.navigate(['/']);
                    this.alertService.success('Successfully verified user. Please sign in again.', { autoClose: true });
                },
                error => {
                    this.logger.error(error);
                    this.alertService.error('User could not be verified. Please double-check your token.');
                    this.loading = false;
                });
    }

    resendVerification() {
        this.loading = true;
        this.alertService.clear();

        const activeModal = this.modalService.open(ModalConfirm);
        activeModal.componentInstance.header = 'Confirm resending verification';
        activeModal.componentInstance.text = 'Are you sure that you want to resend the email verification?';
        activeModal.componentInstance.text2 = 'An email with a new token will be sent to your email address.';
        activeModal.componentInstance.textDanger = '';
        activeModal.result.then(() => {
            this.logger.log('Resending verification');

            if (this.resendSub) {
                this.resendSub.unsubscribe();
            }
            this.verifySub = this.userService.resendVerification()
                .pipe(first())
                .subscribe(
                    data => {
                        this.logger.log('Successfully resent verification. Please check your emails.');

                        this.alertService.success('Successfully resent verification. Please check your emails.', { autoClose: true });
                        this.loading = false;
                    },
                    error => {
                        this.logger.error(error);
                        this.alertService.error('Something went wrong. Could not resend.');
                        this.loading = false;
                    });
        },
            () => {
                this.logger.log('Canceling resending verification.');
                this.loading = false;
            });
    }

}

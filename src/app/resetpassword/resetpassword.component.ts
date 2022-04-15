import { Component, OnInit, OnDestroy, AfterViewInit, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';

import { LoggerService, UserService, AlertService, I18nService } from '../_services';
import { ForgotPassword } from '../_models/forgotPassword.model';
import { Subscription } from 'rxjs';

@Component({
    templateUrl: 'resetpassword.component.html',
    styleUrls: ['./resetpassword.component.scss']
})
export class ResetPasswordComponent implements OnInit, OnDestroy, AfterViewInit {
    public form: FormGroup;
    public loading = false;
    public submitted = false;
    private forgotSub: Subscription;

    private AUTOFOCUS_DELAY_MS = 100;

    constructor(
        public i18nService: I18nService,
        private elementRef: ElementRef,
        private formBuilder: FormBuilder,
        private router: Router,
        private userService: UserService,
        private alertService: AlertService,
        private logger: LoggerService
    ) {
        // Nothing to see here...
    }

    ngOnInit() {
        this.logger.log('Initializing ResetPasswordComponent');

        this.form = this.formBuilder.group({
            username: ['', Validators.required],
            email: ['', Validators.required]
        });
    }

    ngOnDestroy() {
        this.logger.log('Destroying ResetPasswordComponent');

        if (this.forgotSub) {
            this.forgotSub.unsubscribe();
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

        let forgotPassword = new ForgotPassword(this.f.username.value, this.f.email.value);
        this.forgotSub = this.userService.forgotPassword(forgotPassword)
            .pipe(first())
            .subscribe(
                data => {
                    this.logger.log('Successfully requested password reset. Please check your emails.');

                    this.router.navigate(['/account/entertoken']);
                    this.alertService.success(this.i18nService.translate('resetpassword.component.resetpassword_success', 'Successfully requested password reset. Please check your emails.'), { autoClose: false });
                },
                error => {
                    this.logger.error(error);
                    this.alertService.error(this.i18nService.translate('resetpassword.component.resetpassword_fail', 'Password could not be reset. Did you enter the correct username and the corresponding email address?'));
                    this.loading = false;
                });
    }

}

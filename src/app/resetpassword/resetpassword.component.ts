import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';

import { LoggerService, UserService, AlertService } from '../_services';
import { ForgotPassword } from '../_models/forgotPassword.model';
import { Subscription } from 'rxjs';

@Component({
    templateUrl: 'resetpassword.component.html',
    styleUrls: ['./resetpassword.component.scss']
})
export class ResetPasswordComponent implements OnInit, OnDestroy {
    public form: FormGroup;
    public loading = false;
    public submitted = false;
    private forgotSub: Subscription;

    constructor(
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

        let forgotPassword = new ForgotPassword(this.f.username.value, this.f.email.value);
        this.forgotSub = this.userService.forgotPassword(forgotPassword)
            .pipe(first())
            .subscribe(
                data => {
                    this.logger.log('Successfully requested password reset. Please check your emails.');

                    this.router.navigate(['/account/entertoken']);
                    this.alertService.success('Successfully requested password reset. Please check your emails.', { autoClose: false });
                },
                error => {
                    this.logger.error(error);
                    this.alertService.error('Password could not be reset. Did you enter the correct username and the corresponding email address?');
                    this.loading = false;
                });
    }

}

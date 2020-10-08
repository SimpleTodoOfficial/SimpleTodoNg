import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';

import { LoggerService, UserService, AlertService } from '../_services';
import { Subscription } from 'rxjs';

@Component({
    templateUrl: 'entertoken.component.html',
    styleUrls: ['./entertoken.component.scss']
})
export class EnterTokenComponent implements OnInit, OnDestroy {
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
            token: ['', Validators.required]
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

        this.forgotSub = this.userService.resetPassword(this.f.token.value)
            .pipe(first())
            .subscribe(
                data => {
                    this.logger.log('Successfully reset password. Please check your emails.');

                    this.router.navigate(['/account/signin']);
                    this.alertService.success('Successfully reset password. Please check your emails.', { autoClose: false });
                },
                error => {
                    this.logger.error(error);
                    this.alertService.error('Password could not be reset. Please double-check your token.');
                    this.loading = false;
                });
    }

}

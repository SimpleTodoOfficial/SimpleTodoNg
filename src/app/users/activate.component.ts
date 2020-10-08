import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';

import { LoggerService, UserService, AlertService } from '../_services';
import { Subscription } from 'rxjs';

@Component({
    templateUrl: 'activate.component.html',
    styleUrls: ['./users.component.scss']
})
export class ActivateComponent implements OnInit, OnDestroy {
    public form: FormGroup;
    public loading = false;
    public submitted = false;
    public id: string;
    private rtSub: Subscription;
    private activateSub: Subscription;
    private resendSub: Subscription;

    constructor(
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private userService: UserService,
        private alertService: AlertService,
        private logger: LoggerService
    ) {
        // Nothing to see here...
    }

    ngOnInit() {
        this.rtSub = this.route.params.subscribe(params => this.init());
    }

    ngOnDestroy() {
        this.logger.log('Destroying ActivateComponent (User)');

        if (this.rtSub) {
            this.rtSub.unsubscribe();
        }
        if (this.activateSub) {
            this.activateSub.unsubscribe();
        }
        if (this.resendSub) {
            this.resendSub.unsubscribe();
        }
    }

    init() {
        this.logger.log('Initializing ActivateComponent (User)');

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

        if (this.activateSub) {
            this.activateSub.unsubscribe();
        }
        this.activateSub = this.userService.activate(this.f.token.value)
            .pipe(first())
            .subscribe(
                data => {
                    this.logger.log('Successfully activated user. Please sign in again.');

                    this.router.navigate(['/']);
                    this.alertService.success('Successfully activated user. Please sign in again.', { autoClose: true });
                },
                error => {
                    this.logger.error(error);
                    this.alertService.error('User could not be activated. Please double-check your token.');
                    this.loading = false;
                });
    }

    resendActivation() {
        this.loading = true;

        this.alertService.clear();

        if (this.resendSub) {
            this.resendSub.unsubscribe();
        }
        this.activateSub = this.userService.resendActivation()
            .pipe(first())
            .subscribe(
                data => {
                    this.logger.log('Successfully resent activation. Please check your emails.');

                    this.alertService.success('Successfully resent activation. Please check your emails.', { autoClose: true });
                    this.loading = false;
                },
                error => {
                    this.logger.error(error);
                    this.alertService.error('Something went wrong. Could not resend.');
                    this.loading = false;
                });
    }

}

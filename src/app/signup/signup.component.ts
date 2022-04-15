import { Component, OnInit, OnDestroy, AfterViewInit, ElementRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';

import { environment } from '../environments/environment';
import { LoggerService, UserService, AlertService, I18nService } from '../_services';
import { Subscription } from 'rxjs';

@Component({
    templateUrl: 'signup.component.html',
    styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit, OnDestroy, AfterViewInit {
    public form: FormGroup;
    public loading = false;
    public submitted = false;
    private usSub: Subscription;

    private AUTOFOCUS_DELAY_MS = 100;

    constructor(
        public i18nService: I18nService,
        private elementRef: ElementRef,
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
        this.logger.log('Initializing SignupComponent');

        if (!environment.signup) {
            this.logger.log('Signup is disabled, rerouting');
            this.router.navigate(['/']);
        }

        this.form = this.formBuilder.group({
            username: [null, [Validators.required, Validators.minLength(3)]],
            email: [null, [Validators.required, Validators.minLength(6)]],
            password: [null, [Validators.required, Validators.minLength(6)]]
        });
    }

    ngOnDestroy() {
        this.logger.log('Destroying SignupComponent');

        if (this.usSub) {
            this.usSub.unsubscribe();
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

        if (this.usSub) {
            this.usSub.unsubscribe();
        }
        let user = this.form.value;
        user.jsonData = '{}';
        this.usSub = this.userService.signup(user)
            .pipe(first())
            .subscribe(
                data => {
                    this.router.navigate(['../signin'], {
                        relativeTo: this.route
                    });
                    this.alertService.success(this.i18nService.translate('signin.component.registration_success', 'Registration successful.'));
                },
                error => {
                    this.logger.error(error);
                    this.alertService.error(this.i18nService.translate('signin.component.registration_fail', 'User could not be registered.'));
                    this.loading = false;
                });
    }

}

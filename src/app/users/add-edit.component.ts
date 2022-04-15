import { Component, OnInit, OnDestroy, AfterViewInit, ElementRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators, } from '@angular/forms';
import { first } from 'rxjs/operators';

import { LoggerService, UserService, AlertService, I18nService } from '../_services';
import { Subscription } from 'rxjs';

@Component({
    templateUrl: 'add-edit.component.html',
    styleUrls: ['./users.component.scss']
})
export class AddEditComponent implements OnInit, OnDestroy, AfterViewInit {
    public form: FormGroup;
    public isAddMode: boolean;
    public loading = false;
    public submitted = false;
    public id: string;
    private rtSub: Subscription;
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
        this.rtSub = this.route.params.subscribe(params => this.init());
    }

    ngOnDestroy() {
        this.logger.log('Destroying AddEditComponent (User)');

        if (this.rtSub) {
            this.rtSub.unsubscribe();
        }
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

    init() {
        this.logger.log('Initializing AddEditComponent (User)');

        this.loading = true;

        this.id = this.route.snapshot.params['id'];
        this.isAddMode = !this.id;

        const passwordValidators = [Validators.minLength(6)];
        if (this.isAddMode) {
            passwordValidators.push(Validators.required);
        }

        this.form = this.formBuilder.group({
            username: ['', Validators.required],
            email: ['', Validators.required],
            password: ['', passwordValidators]
        });

        if (!this.isAddMode) {
            if (this.usSub) {
                this.usSub.unsubscribe();
            }
            this.usSub = this.userService.getById(this.id)
                .pipe(first())
                .subscribe(x => {
                    this.logger.log('Successfully loaded the user');
                    this.f.username.setValue(x.username);
                    this.f.email.setValue(x.email);
                    this.loading = false;
                },
                    error => {
                        this.logger.error(error);
                        this.router.navigate(['/']);
                        this.alertService.error(this.i18nService.translate('users.addedit.component.error.user_load', 'User could not be loaded.'));
                    });
        } else {
            this.loading = false;
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

        if (this.isAddMode) {
            this.createUser();
        } else {
            this.updateUser();
        }
    }

    private createUser() {
        this.logger.log('Adding a user');

        if (this.usSub) {
            this.usSub.unsubscribe();
        }
        let user = this.form.value;
        user.jsonData = '{}';
        this.usSub = this.userService.signup(user)
            .pipe(first())
            .subscribe(
                data => {
                    this.logger.log('User successfully added.');
                    this.router.navigate(['.', { relativeTo: this.route }]);
                    this.alertService.success(this.i18nService.translate('users.addedit.component.success.user_add', 'User successfully added.'));
                    this.loading = false;
                },
                error => {
                    this.logger.error(error);
                    this.alertService.error(this.i18nService.translate('users.addedit.component.error.user_add', 'User could not be added.'));
                    this.loading = false;
                });
    }

    private updateUser() {
        if (this.usSub) {
            this.usSub.unsubscribe();
        }
        this.usSub = this.userService.update(this.id, this.form.value)
            .pipe(first())
            .subscribe(
                data => {
                    this.logger.log('User successfully updated');
                    if (!data.signedOut) {
                        this.router.navigate(['..', { relativeTo: this.route }]);
                    }
                    this.alertService.success(this.i18nService.translate('users.addedit.component.success.user_update', 'User successfully updated.'));
                    this.loading = false;
                },
                error => {
                    this.logger.error(error);
                    this.alertService.error(this.i18nService.translate('users.addedit.component.error.user_update', 'User could not be updated. Maybe the email address is already in use?'));
                    this.loading = false;
                });
    }

}

import { Component, OnInit, OnDestroy, AfterViewInit, ElementRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';

import { LoggerService, ListService, AlertService, I18nService } from '../_services';
import { Subscription } from 'rxjs';

@Component({
    templateUrl: 'add-edit.component.html',
    styleUrls: ['./lists.component.scss']
})
export class AddEditComponent implements OnInit, OnDestroy, AfterViewInit {
    public form: FormGroup;
    public isAddMode: boolean;
    public loading = false;
    public submitted = false;
    public wsId: string;
    public id: string;
    private rtpSub: Subscription;
    private rtppSub: Subscription;
    private lssSub: Subscription;

    private AUTOFOCUS_DELAY_MS = 100;

    constructor(
        public i18nService: I18nService,
        private elementRef: ElementRef,
        private formBuilder: FormBuilder,
        private router: Router,
        private route: ActivatedRoute,
        private listService: ListService,
        private alertService: AlertService,
        private logger: LoggerService
    ) {
        // Nothing to see here...
    }

    ngOnInit() {
        this.rtpSub = this.route.params.subscribe(params => this.init());
    }

    ngOnDestroy() {
        this.logger.log('Destroying AddEditComponent (List)');

        if (this.rtpSub) {
            this.rtpSub.unsubscribe();
        }
        if (this.rtppSub) {
            this.rtppSub.unsubscribe();
        }
        if (this.lssSub) {
            this.lssSub.unsubscribe();
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
        this.logger.log('Initializing AddEditComponent (List)');

        this.loading = true;

        this.id = this.route.snapshot.params['id'];
        this.isAddMode = !this.id;

        this.form = this.formBuilder.group({
            name: ['', [Validators.required, Validators.maxLength(100)]]
        });

        if (this.rtppSub) {
            this.rtppSub.unsubscribe();
        }
        this.rtppSub = this.route.parent.params.subscribe(params => {
            this.wsId = params["id"];
            this.id = this.route.snapshot.params['id'];

            if (!this.isAddMode) {
                if (this.lssSub) {
                    this.lssSub.unsubscribe();
                }
                this.lssSub = this.listService.getById(this.wsId, this.id)
                    .pipe(first())
                    .subscribe(x => {
                        this.f.name.setValue(x.name);
                        this.loading = false;
                    },
                        error => {
                            this.logger.error(error);
                            this.router.navigate(['/']);
                            this.alertService.error(this.i18nService.translate('lists.addedit.component.error.list_load', 'List could not be loaded.'));
                        });
            } else {
                this.loading = false;
            }
        });
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

        this.loading = true;
        if (this.isAddMode) {
            this.createList();
        } else {
            this.updateList();
        }
    }

    private createList() {
        this.logger.log('Creating list');

        if (this.lssSub) {
            this.lssSub.unsubscribe();
        }
        this.lssSub = this.listService.create(this.wsId, this.form.value)
            .pipe(first())
            .subscribe(
                data => {
                    this.logger.log('List created successfully.');
                    this.router.navigate(['/workspaces', this.wsId, 'lists', data['id'], 'todos']);
                    this.alertService.success(this.i18nService.translate('lists.addedit.component.success.list_created', 'List successfully created.'));
                    this.loading = false;
                },
                error => {
                    this.logger.error(error);
                    this.alertService.error(this.i18nService.translate('lists.addedit.component.error.lists_created', 'List could not be created.'));
                    this.loading = false;
                });
    }

    private updateList() {
        this.logger.log('Updating list');

        if (this.lssSub) {
            this.lssSub.unsubscribe();
        }
        this.lssSub = this.listService.update(this.wsId, this.id, this.form.value)
            .pipe(first())
            .subscribe(
                data => {
                    this.logger.log('List updated successfully.');
                    this.router.navigate(['/workspaces', this.wsId, 'lists', data['id']]);
                    this.alertService.success(this.i18nService.translate('lists.addedit.component.success.list_updated', 'List successfully updated.'));
                    this.loading = false;
                },
                error => {
                    this.logger.error(error);
                    this.alertService.error(this.i18nService.translate('lists.addedit.component.error.list_updated', 'List could not be updated.'));
                    this.loading = false;
                });
    }

}

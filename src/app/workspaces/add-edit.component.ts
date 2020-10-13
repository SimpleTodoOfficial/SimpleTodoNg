import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';

import { LoggerService, WorkspaceService, AlertService, I18nService } from '../_services';
import { Subscription } from 'rxjs';

@Component({
    templateUrl: 'add-edit.component.html',
    styleUrls: ['./workspaces.component.scss']
})
export class AddEditComponent implements OnInit, OnDestroy {
    public form: FormGroup;
    public isAddMode: boolean;
    public loading = false;
    public submitted = false;
    public id: string;
    private rtSub: Subscription;
    private wssSub: Subscription;

    constructor(
        public i18nService: I18nService,
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private workspaceService: WorkspaceService,
        private alertService: AlertService,
        private logger: LoggerService
    ) {
        // Nothing to see here...
    }

    ngOnInit() {
        this.rtSub = this.route.params.subscribe(params => this.init());
    }

    ngOnDestroy() {
        this.logger.log('Destroying AddEditComponent (Workspace)');

        if (this.rtSub) {
            this.rtSub.unsubscribe();
        }
    }

    init() {
        this.logger.log('Initializing AddEditComponent (Workspace)');

        this.loading = true;

        this.id = this.route.snapshot.params['id'];
        this.isAddMode = !this.id;

        this.form = this.formBuilder.group({
            name: ['', [Validators.required, Validators.maxLength(100)]],
        });

        if (!this.isAddMode) {
            if (this.wssSub) {
                this.wssSub.unsubscribe();
            }
            this.wssSub = this.workspaceService.getById(this.id)
                .pipe(first())
                .subscribe(x => {
                    this.f.name.setValue(x.name);
                    this.loading = false;
                },
                    error => {
                        this.logger.error(error);
                        this.router.navigate(['/']);
                        this.alertService.error(this.i18nService.translate('workspaces.addedit.component.error.workspace_load', 'Workspace could not be loaded.'));
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
        this.alertService.clear();

        if (this.form.invalid) {
            this.loading = false;
            return;
        }

        if (this.isAddMode) {
            this.createWorkspace();
        } else {
            this.updateWorkspace();
        }
    }

    private createWorkspace() {
        this.logger.log('Creating workspace');

        this.loading = true;

        if (this.wssSub) {
            this.wssSub.unsubscribe();
        }
        this.wssSub = this.workspaceService.create(this.form.value)
            .pipe(first())
            .subscribe(
                data => {
                    this.logger.log('Workspace successfully created');
                    this.router.navigate(['/workspaces', data['id'], 'lists']);
                    this.alertService.success(this.i18nService.translate('workspaces.addedit.component.success.workspace_created', 'Workspace successfully created.'), { autoClose: true });
                },
                error => {
                    this.logger.error(error);
                    this.alertService.error(this.i18nService.translate('workspaces.addedit.component.error.workspace_created', 'Workspace could not be created.'));
                    this.loading = false;
                });
    }

    private updateWorkspace() {
        this.logger.log('Updating workspace');

        this.loading = true;

        if (this.wssSub) {
            this.wssSub.unsubscribe();
        }
        this.wssSub = this.workspaceService.update(this.id, this.form.value)
            .pipe(first())
            .subscribe(
                data => {
                    this.logger.log('Workspace successfully updated');
                    this.router.navigate(['/workspaces', data['id']]);
                    this.alertService.success(this.i18nService.translate('workspaces.addedit.component.success.workspace_updated', 'Workspace successfully updated.'), { autoClose: true });
                },
                error => {
                    this.logger.error(error);
                    this.alertService.error(this.i18nService.translate('workspaces.addedit.component.error.workspace_updated', 'Workspace could not be updated.'));
                    this.loading = false;
                });
    }

}

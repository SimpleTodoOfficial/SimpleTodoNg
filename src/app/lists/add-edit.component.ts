import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';

import { LoggerService, ListService, AlertService } from '../_services';
import { Subscription } from 'rxjs';

@Component({
    templateUrl: 'add-edit.component.html',
    styleUrls: ['./lists.component.scss']
})
export class AddEditComponent implements OnInit, OnDestroy {
    public form: FormGroup;
    public isAddMode: boolean;
    public loading = false;
    public submitted = false;
    public wsId: string;
    public id: string;
    private rtpSub: Subscription;
    private rtppSub: Subscription;
    private lssSub: Subscription;

    constructor(
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
                            this.alertService.error('List could not be loaded.');
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
        this.alertService.clear();

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
                    this.alertService.success('List created successfully.', { autoClose: true });
                    this.loading = false;
                },
                error => {
                    this.logger.error(error);
                    this.alertService.error('List could not be created.');
                    this.loading = false;
                });
    }

    private updateList() {
        this.logger.log('Updating list');

        let listName = this.form.value.name;
        if (this.lssSub) {
            this.lssSub.unsubscribe();
        }
        this.lssSub = this.listService.update(this.wsId, this.id, this.form.value)
            .pipe(first())
            .subscribe(
                data => {
                    this.logger.log('List updated successfully.');
                    this.router.navigate(['/workspaces', this.wsId, 'lists', data['id']]);
                    this.alertService.success('List "' + listName + '" updated successfully.', { autoClose: true });
                    this.loading = false;
                },
                error => {
                    this.logger.error(error);
                    this.alertService.error('List "' + listName + '" could not be updated.');
                    this.loading = false;
                });
    }

}

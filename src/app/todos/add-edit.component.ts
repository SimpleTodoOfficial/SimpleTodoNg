import { Component, OnInit, OnDestroy, AfterViewInit, ElementRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { faCalendarAlt } from '@fortawesome/free-solid-svg-icons';

import { LoggerService, TodoService, AlertService, DateTimeService, I18nService } from '../_services';
import { Todo } from '../_models';
import { Subscription } from 'rxjs';

@Component({
    templateUrl: 'add-edit.component.html',
    styleUrls: ['./todos.component.scss']
})
export class AddEditComponent implements OnInit, OnDestroy, AfterViewInit {
    public loading = false;
    public form: FormGroup;
    public isAddMode: boolean;
    public submitted = false;
    public dueDate: NgbDateStruct;
    public dueTime: any;
    public wsId: string;
    public lsId: string;
    public id: string;
    public dueDateCollapsed: boolean = true;
    private rtSub: Subscription;
    private wsSub: Subscription;
    private lsSub: Subscription;
    private tdsSub: Subscription;

    public faCalendarAlt = faCalendarAlt;

    private AUTOFOCUS_DELAY_MS = 100;

    constructor(
        public i18nService: I18nService,
        private elementRef: ElementRef,
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private todoService: TodoService,
        private alertService: AlertService,
        private dateTimeService: DateTimeService,
        private logger: LoggerService
    ) {
        // Nothing to see here...
    }

    ngOnInit() {
        this.rtSub = this.route.params.subscribe(params => this.init());
    }

    ngOnDestroy() {
        this.logger.log('Destroying AddEditComponent (Todo)');

        if (this.rtSub) {
            this.rtSub.unsubscribe();
        }
        if (this.wsSub) {
            this.wsSub.unsubscribe();
        }
        if (this.lsSub) {
            this.lsSub.unsubscribe();
        }
        if (this.tdsSub) {
            this.tdsSub.unsubscribe();
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
        this.logger.log('Initializing AddEditComponent (Todo)');

        this.loading = true;

        this.id = this.route.snapshot.params['id'];
        this.isAddMode = !this.id;

        this.form = this.formBuilder.group({
            msg: ['', [Validators.required, Validators.maxLength(1024)]],
            url: ['', [Validators.maxLength(1024)]],
            done: [false],
            dueDate: [null],
            dueTime: [null]
        });
        if (this.wsSub) {
            this.wsSub.unsubscribe();
        }
        this.wsSub = this.route.parent.parent.parent.params.subscribe(paramsWs => {
            this.wsId = paramsWs["id"];
            if (this.lsSub) {
                this.lsSub.unsubscribe();
            }
            this.lsSub = this.route.parent.parent.params.subscribe(paramsLs => {
                this.lsId = paramsLs["id"];
                this.id = this.route.snapshot.params['id'];

                if (!this.isAddMode) {
                    if (this.tdsSub) {
                        this.tdsSub.unsubscribe();
                    }
                    this.tdsSub = this.todoService.getById(this.wsId, this.lsId, this.id)
                        .pipe(first())
                        .subscribe(x => {
                            this.f.msg.setValue(x.msg);
                            this.f.url.setValue(x.url);
                            this.f.done.setValue(x.done);
                            this.parseDateTimeFromStr(x.dueDate);
                            this.loading = false;
                        },
                            error => {
                                this.logger.error(error);
                                this.router.navigate(['/']);
                                this.alertService.error(this.i18nService.translate('todos.addedit.component.error.todo_load', 'Todo could not be loaded.'));
                            });
                } else {
                    this.loading = false;
                }
            });
        });
    }

    parseDateTimeFromStr(dueDateStr: string): void {
        let datetime = this.dateTimeService.parseDateTimeFromStr(dueDateStr);
        if (datetime) {
            this.form.controls.dueDate.setValue({
                day: datetime.date.day,
                month: datetime.date.month,
                year: datetime.date.year
            });
            this.form.controls.dueTime.setValue({
                hour: datetime.time.hour,
                minute: datetime.time.minute,
                second: datetime.time.second
            });
        }
    }

    getDateTimeAsStr(): string {
        let dateValue = this.form.controls.dueDate.value;
        let timeValue = this.form.controls.dueTime.value;

        return this.dateTimeService.getDateTimeAsStr(dateValue, timeValue);
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
            this.createTodo();
        } else {
            this.updateTodo();
        }
    }

    private createTodo() {
        this.logger.log('Creating todo');

        this.loading = true;

        let todo = new Todo(null, this.form.controls.msg.value, this.form.controls.url.value, this.form.controls.done.value, null, null, null, null, this.getDateTimeAsStr(), null);
        if (this.tdsSub) {
            this.tdsSub.unsubscribe();
        }
        this.tdsSub = this.todoService.create(this.wsId, this.lsId, todo)
            .pipe(first())
            .subscribe(
                data => {
                    this.logger.log('Todo created successfully');
                    this.router.navigate(['/workspaces', this.wsId, 'lists', this.lsId, 'todos']);
                },
                error => {
                    this.logger.error(error);
                    this.alertService.error(this.i18nService.translate('todos.addedit.component.error.todo_create', 'Todo could not be created.'));
                    this.loading = false;
                });
    }

    private updateTodo() {
        this.logger.log('Updating todo');

        this.loading = true;

        let todo = new Todo(this.id, this.form.controls.msg.value, this.form.controls.url.value, this.form.controls.done.value, null, null, null, null, this.getDateTimeAsStr(), null);
        if (this.tdsSub) {
            this.tdsSub.unsubscribe();
        }
        this.tdsSub = this.todoService.update(this.wsId, this.lsId, this.id, todo)
            .pipe(first())
            .subscribe(
                data => {
                    this.logger.log('Todo updated successfully');
                    this.router.navigate(['/workspaces', this.wsId, 'lists', this.lsId, 'todos']);
                },
                error => {
                    this.logger.error(error);
                    this.alertService.error(this.i18nService.translate('todos.addedit.component.error.todo_update', 'Todo could not be updated.'));
                    this.loading = false;
                });
    }

}

import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { BreakpointObserver } from '@angular/cdk/layout';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { first } from 'rxjs/operators';
import { faClock, faGripLines, faSync, faTh, faClipboardList, faList, faPlusCircle, faEdit, faTrashAlt, faUserCircle } from '@fortawesome/free-solid-svg-icons';

import { LoggerService, TodoService, AlertService, ListService, WorkspaceService, I18nService } from '../_services';
import { Workspace, List, Todo } from '../_models';
import { Subscription } from 'rxjs';

@Component({
    templateUrl: 'list.component.html',
    styleUrls: ['./todos.component.scss']
})
export class ListComponent implements OnInit, OnDestroy {
    public loading = false;
    public refreshing = false;
    public todos = [];
    public deletingAll = false;
    public shortenWsName: number = 15;
    public shortenLsNameBreadcrumb: number = 15;
    public shortenTodoMsg: number = 85;
    public workspace: Workspace;
    public list: List;
    public wsId: string;
    public lsId: string;
    public todoList = [];
    public todoHiddenList = [];
    public showAllTodos: boolean = false;
    public isUpdatingTodoList: boolean = false;
    private rtSub: Subscription;
    private wsSub: Subscription;
    private lsSub: Subscription;
    private tdsSub: Subscription;
    private wssSub: Subscription;
    private lssSub: Subscription;
    private obSub: Subscription;

    public faClock = faClock;
    public faTh = faTh;
    public faClipboardList = faClipboardList;
    public faList = faList;
    public faPlusCircle = faPlusCircle;
    public faEdit = faEdit;
    public faTrashAlt = faTrashAlt;
    public faUserCircle = faUserCircle;
    public faSync = faSync;
    public faGripLines = faGripLines;

    constructor(
        public i18nService: I18nService,
        private router: Router,
        private observer: BreakpointObserver,
        private route: ActivatedRoute,
        private todoService: TodoService,
        private alertService: AlertService,
        private listService: ListService,
        private workspaceService: WorkspaceService,
        private logger: LoggerService
    ) {
        this.observerScreenSize();
    }

    ngOnInit() {
        this.rtSub = this.route.params.subscribe(_ => this.init());
    }

    ngOnDestroy() {
        this.logger.log('Destroying ListComponent (Todos)');

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
        if (this.wssSub) {
            this.wssSub.unsubscribe();
        }
        if (this.lssSub) {
            this.lssSub.unsubscribe();
        }
        if (this.obSub) {
            this.obSub.unsubscribe();
        }
    }

    init() {
        this.logger.log('Initializing ListComponent (Todos)');

        this.loading = true;

        this.refresh();
    }

    refresh() {
        this.logger.log('Refreshing todos');

        this.refreshing = true;

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

                if (this.tdsSub) {
                    this.tdsSub.unsubscribe();
                }
                this.tdsSub = this.todoService.getAll(this.wsId, this.lsId)
                    .pipe(first())
                    .subscribe({
                        next: todos => {
                            this.todos = todos;

                            if (this.wssSub) {
                                this.wssSub.unsubscribe();
                            }
                            this.wssSub = this.workspaceService.getById(this.wsId)
                                .pipe(first())
                                .subscribe({
                                    next: workspace => {
                                        this.workspace = workspace;

                                        if (this.lssSub) {
                                            this.lssSub.unsubscribe();
                                        }
                                        this.lssSub = this.listService.getById(this.wsId, this.lsId)
                                            .pipe(first())
                                            .subscribe({
                                                next: list => {
                                                    this.list = list;
                                                    this.calculateLists();
                                                    this.loading = false;
                                                    this.refreshing = false;
                                                    this.deletingAll = false;
                                                },
                                                error: error => {
                                                    this.logger.error(error);
                                                    this.router.navigate(['/']);
                                                    this.alertService.error(this.i18nService.translate('todos.list.component.error.list_load', 'List could not be loaded.'));
                                                }
                                            });
                                    },
                                    error: error => {
                                            this.logger.error(error);
                                            this.router.navigate(['/']);
                                            this.alertService.error(this.i18nService.translate('todos.list.component.error.workspace_load', 'Workspace could not be loaded.'));
                                    }
                                });
                        },
                        error: error => {
                            this.logger.error(error);
                            this.router.navigate(['/']);
                            this.alertService.error(this.i18nService.translate('todos.list.component.error.todo_load', 'Todo could not be loaded.'));
                        }
                    });
            });
        });
    }

    calculateLists(): void {
        let tList = this.todos;
        let todoList = [];
        let todoHiddenList = [];

        this.logger.log('Checking for sorted data on the list');
        let foundList = [];
        let foundHiddenList = [];
        if (this.list.jsonData) {
            let jsonData = JSON.parse(this.list.jsonData);
            if (jsonData && jsonData.list && jsonData.hiddenList) {
                this.logger.log('Found list JSON data');
                foundList = jsonData.list;
                foundHiddenList = jsonData.hiddenList;
            } else {
                this.logger.log('Found jsonData, but did not find list JSON data on the list');
            }
        } else {
            this.logger.log('No jsonData found on the list');
        }

        this.logger.log('Updating list data');
        let localList = tList.filter(t => t && !t.done).map(t => t.id);
        for (let i in foundList) {
            if (localList.includes(foundList[i])) {
                todoList.push(foundList[i]);
            }
        }
        for (let i in localList) {
            if (!todoList.includes(localList[i])) {
                todoList.push(localList[i]);
            }
        }

        this.logger.log('Updating hidden list data');
        let localHiddenList = tList.filter(t => t && t.done).map(t => t.id);
        for (let i in foundHiddenList) {
            if (localHiddenList.includes(foundHiddenList[i])) {
                todoHiddenList.push(foundHiddenList[i]);
            }
        }
        for (let i in localHiddenList) {
            if (!todoHiddenList.includes(localHiddenList[i])) {
                todoHiddenList.push(localHiddenList[i]);
            }
        }

        this.logger.log('Mapping list data');
        this.todoList = todoList.map(tId => this.getTodo(tId));
        this.todoHiddenList = todoHiddenList.map(tId => this.getTodo(tId));

        let updateLs = false;
        let arrBefore = foundList;
        let arrAfter = this.todoList.map(l => l.id);
        if (arrBefore.length != arrAfter.length) {
            updateLs = true;
        } else {
            for (let elPos in arrBefore) {
                if (arrBefore[elPos] !== arrAfter[elPos]) {
                    updateLs = true;
                    break;
                }
            }
        }
        if (updateLs) {
            this.updateList();
        }
    }

    getTodo(id: string): Todo {
        return this.todos.find(t => t.id === id);
    }

    observerScreenSize(): void {
        this.obSub = this.observer.observe([
            '(min-width: 300px)',
            '(min-width: 410px)',
            '(min-width: 525px)',
            '(min-width: 600px)',
            '(min-width: 700px)',
            '(min-width: 800px)'
        ]).subscribe(result => {
            if (result.matches) {
                if (result.breakpoints['(min-width: 800px)']) {
                    this.shortenLsNameBreadcrumb = 70;
                    this.shortenWsName = 20;
                } else if (result.breakpoints['(min-width: 700px)']) {
                    this.shortenLsNameBreadcrumb = 48;
                    this.shortenWsName = 15;
                } else if (result.breakpoints['(min-width: 600px)']) {
                    this.shortenLsNameBreadcrumb = 48;
                    this.shortenWsName = 15;
                } else if (result.breakpoints['(min-width: 525px)']) {
                    this.shortenLsNameBreadcrumb = 42;
                    this.shortenWsName = 15;
                } else if (result.breakpoints['(min-width: 410px)']) {
                    this.shortenLsNameBreadcrumb = 26;
                    this.shortenWsName = 15;
                } else if (result.breakpoints['(min-width: 300px)']) {
                    this.shortenLsNameBreadcrumb = 18;
                    this.shortenWsName = 10;
                } else {
                    this.shortenLsNameBreadcrumb = 12;
                    this.shortenWsName = 10;
                }
            } else {
                this.shortenLsNameBreadcrumb = 10;
                this.shortenWsName = 6;
            }
        });
    }

    dropList(event: CdkDragDrop<string[]>) {
        if (event.previousContainer === event.container) {
            moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
        } else {
            transferArrayItem(event.previousContainer.data,
                event.container.data,
                event.previousIndex,
                event.currentIndex);
        }
        this.updateList();
    }

    dropHiddenList(event: CdkDragDrop<string[]>) {
        if (event.previousContainer === event.container) {
            moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
        } else {
            transferArrayItem(event.previousContainer.data,
                event.container.data,
                event.previousIndex,
                event.currentIndex);
        }
        this.updateList();
    }

    getIdList(list: Todo[]): string[] {
        return list.map(t => t.id);
    }

    displayTodo(todo: Todo): boolean {
        return this.showAllTodos || !todo.done;
    }

    deleteAllTodos() {
        if (!this.deletingAll) {
            this.deletingAll = true;
            let lst = this.todoHiddenList.map(t => t.id);
            let promises = [];
            for (let i in lst) {
                let id = lst[i];
                const todo = this.todos.find(t => t.id === id);
                if (todo) {
                    todo.isDeleting = true;
                    if (this.tdsSub) {
                        this.tdsSub.unsubscribe();
                    }
                    let prom = this.todoService.delete(this.wsId, this.lsId, id);
                    promises.push(prom);
                    prom.subscribe({
                        next: () => {
                            this.logger.log('Todo deleted');
                            this.todos = this.todos.filter(x => x.id !== id);
                            this.calculateLists();
                            this.updateList();
                        },
                        error: error => {
                            this.logger.error(error);
                            this.alertService.error(this.i18nService.translate('todos.list.component.error.todo_delete', 'Todo could not be deleted.'));
                            this.loading = false;
                        }
                    });
                }
            }
            Promise.all(promises).then(_ => {
                this.refresh();
                this.updateList();
                this.deletingAll = false;
            });
        }
    }

    deleteTodo(id: string) {
        const todo = this.todos.find(t => t.id === id);
        if (todo) {
            todo.isDeleting = true;
            if (this.tdsSub) {
                this.tdsSub.unsubscribe();
            }
            this.tdsSub = this.todoService.delete(this.wsId, this.lsId, id)
                .subscribe({
                    next: () => {
                        this.logger.log('Todo deleted');
                        this.todos = this.todos.filter(x => x.id !== id);
                        this.calculateLists();
                        this.updateList();
                    },
                    error: error => {
                        this.logger.error(error);
                        this.alertService.error(this.i18nService.translate('todos.list.component.error.todo_delete', 'Todo could not be deleted.'));
                        this.loading = false;
                    }
                });
        }
    }

    toggleDone(id: string) {
        const todo = this.todos.find(x => x.id === id);
        todo.isUpdating = true;
        todo.done = !todo.done;
        this.updateTodo(todo);
    }

    updateTodo(todo: any) {
        if (this.tdsSub) {
            this.tdsSub.unsubscribe();
        }
        this.tdsSub = this.todoService.update(this.wsId, this.lsId, todo.id, todo)
            .subscribe({
                next: () => {
                    this.logger.log('Todo updated');
                    this.calculateLists();
                    this.updateList();
                    todo.isUpdating = false;
                },
                error: error => {
                    this.logger.error(error);
                    this.alertService.error(this.i18nService.translate('todos.list.component.error.todo_update', 'Todo could not be updated.'));
                    this.loading = false;
                    this.calculateLists();
                    this.updateList();
                    todo.isUpdating = false;
                }
            });
    }

    private updateList() {
        this.isUpdatingTodoList = true;
        this.list.jsonData = JSON.stringify({
            list: this.todoList.map(t => t.id),
            hiddenList: this.todoHiddenList.map(t => t.id)
        });
        if (this.lssSub) {
            this.lssSub.unsubscribe();
        }
        this.lssSub = this.listService.update(this.list.workspaceId, this.list.id, this.list)
            .pipe(first())
            .subscribe({
                next: _ => {
                    this.logger.log('Saved todo order');
                    this.isUpdatingTodoList = false;
                },
                error: error => {
                    this.logger.error(error);
                    this.alertService.error(this.i18nService.translate('todos.list.component.error.list_update', 'Todo order could not be saved.'));
                    this.loading = false;
                    this.isUpdatingTodoList = false;
                }
            });
    }

}

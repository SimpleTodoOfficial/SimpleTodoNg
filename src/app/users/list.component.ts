import { Component, OnInit, OnDestroy } from '@angular/core';
import { first } from 'rxjs/operators';
import { BreakpointObserver } from '@angular/cdk/layout';
import { LoggerService, UserService, AlertService } from '../_services';
import { faSync, faUserCircle, faPlusCircle, faEdit } from '@fortawesome/free-solid-svg-icons';
import { Subscription } from 'rxjs';

@Component({
    templateUrl: 'list.component.html',
    styleUrls: ['./users.component.scss']
})
export class ListComponent implements OnInit, OnDestroy {
    public loading = false;
    public refreshing = false;
    public error = false;
    public users = [];
    public shortenUName: number = 25;
    private usSub: Subscription;
    private obSub: Subscription;

    public faUserCircle = faUserCircle;
    public faPlusCircle = faPlusCircle;
    public faEdit = faEdit;
    public faSync = faSync;

    constructor(
        private observer: BreakpointObserver,
        private userService: UserService,
        private alertService: AlertService,
        private logger: LoggerService
    ) {
        this.observerScreenSize();
    }

    ngOnInit() {
        this.logger.log('Initializing ListComponent (Users)');

        this.loading = true;
        this.refresh();
    }

    ngOnDestroy() {
        this.logger.log('Destroying ListComponent (Users)');

        if (this.usSub) {
            this.usSub.unsubscribe();
        }
        if (this.obSub) {
            this.obSub.unsubscribe();
        }
    }


    refresh() {
        this.logger.log('Refreshing users');

        this.refreshing = true;
        if (this.usSub) {
            this.usSub.unsubscribe();
        }
        this.usSub = this.userService.getAll()
            .pipe(first())
            .subscribe(users => {
                this.users = users;
                this.loading = false;
                this.refreshing = false;
                this.error = false;
            },
            error => {
                this.logger.error(error);
                this.alertService.error('Users could not be loaded.');
                this.loading = false;
                this.refreshing = false;
                this.error = true;
            });
    }

    observerScreenSize(): void {
        this.obSub = this.observer.observe([
            '(min-width: 300px)',
            '(min-width: 400px)',
            '(min-width: 500px)',
            '(min-width: 600px)',
            '(min-width: 700px)',
            '(min-width: 800px)'
        ]).subscribe(result => {
            if (result.matches) {
                if (result.breakpoints['(min-width: 800px)']) {
                    this.shortenUName = 90;
                } else if (result.breakpoints['(min-width: 700px)']) {
                    this.shortenUName = 70;
                } else if (result.breakpoints['(min-width: 600px)']) {
                    this.shortenUName = 65;
                } else if (result.breakpoints['(min-width: 500px)']) {
                    this.shortenUName = 55;
                } else if (result.breakpoints['(min-width: 400px)']) {
                    this.shortenUName = 45;
                } else if (result.breakpoints['(min-width: 300px)']) {
                    this.shortenUName = 32;
                } else {
                    this.shortenUName = 25;
                }
            } else {
                this.shortenUName = 25;
            }
        });
    }

}

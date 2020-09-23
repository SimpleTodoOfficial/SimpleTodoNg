import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { Router, NavigationStart, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

import { Alert, AlertType } from '../_models';
import { LoggerService, AlertService } from '../_services';

@Component({
    selector: 'alert',
    templateUrl: 'alert.component.html',
    styleUrls: ['./alert.component.scss']
})
export class AlertComponent implements OnInit, OnDestroy {
    @Input() id = 'default-alert';

    public alerts: Alert[] = [];
    private alSub: Subscription;
    private rtSub: Subscription;
    private rtpSub: Subscription;

    private classes = [];
    private alertTypeClass = {};
    private AUTO_CLOSE_TIME_MS = 3200;

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private alertService: AlertService,
        private logger: LoggerService
    ) {
        // Nothing to see here...
    }

    ngOnInit() {
        this.logger.log('Initializing AlertComponent');

        if (this.alSub) {
            this.alSub.unsubscribe();
        }
        this.alSub = this.alertService.onAlert(this.id)
            .subscribe(alert => {
                if (!alert.message) {
                    this.alerts.forEach(x => this.removeAlert(x));
                    return;
                }

                this.logger.log('New alert: [type=' + alert.type + ', msg=' + alert.message + ']')
                this.alerts.push(alert);
                if (alert.autoClose) {
                    setTimeout(() => this.removeAlert(alert), this.AUTO_CLOSE_TIME_MS);
                }
            });

        if (this.rtSub) {
            this.rtSub.unsubscribe();
        }
        this.rtSub = this.router.events.subscribe(event => {
            if (event instanceof NavigationStart) {
                this.alertService.clear(this.id);
            }
        });

        this.alertTypeClass = {
            [AlertType.Success]: 'alert-success',
            [AlertType.Error]: 'alert-danger',
            [AlertType.Info]: 'alert-info',
            [AlertType.Warning]: 'alert-warning',
            [AlertType.Primary]: 'alert-primary',
            [AlertType.Secondary]: 'alert-secondary'
        }

        if (this.rtpSub) {
            this.rtpSub.unsubscribe();
        }
        this.rtpSub = this.route.params.subscribe(params => this.alertService.clear(this.id));
    }

    ngOnDestroy() {
        this.logger.log('Destroying AlertComponent');

        if (this.alSub) {
            this.alSub.unsubscribe();
        }
        if (this.rtSub) {
            this.rtSub.unsubscribe();
        }
        if (this.rtpSub) {
            this.rtpSub.unsubscribe();
        }
    }

    removeAlert(alert: Alert) {
        if (!this.alerts.includes(alert)) {
            return;
        }

        this.alerts = this.alerts.filter(x => x !== alert);
    }

    getCssClass(alert: Alert) {
        this.classes = ['alert', 'alert-dismissable'];
        if (!alert) {
            this.classes.push(this.alertTypeClass[AlertType.Primary]);
        } else {
            const theType = this.alertTypeClass[alert.type];
            if (theType) {
                this.classes.push(theType);
            } else {
                this.classes.push(this.alertTypeClass[AlertType.Primary]);
            }
        }

        return this.classes.join(' ');
    }

}

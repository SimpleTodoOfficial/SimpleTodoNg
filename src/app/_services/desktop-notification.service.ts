import { Injectable } from '@angular/core';

import { LoggerService } from './logger.service';
import { AlertService } from './alert.service';

@Injectable({
    providedIn: 'root'
})
export class DesktopNotificationService {
    private notificationsAvailable: boolean;
    private permissionGranted: boolean;

    constructor(
        private logger: LoggerService,
        private alertService: AlertService
    ) {
        try {
            this.permissionGranted = Notification !== undefined
                && Notification.permission === 'granted';
            this.notificationsAvailable = true;
        } catch (err) {
            this.notificationsAvailable = false;
            this.permissionGranted = false;
        }
    }

    askForPermissions() {
        if (!this.notificationsAvailable) {
            return false;
        }

        return Notification !== undefined
            && Notification.permission !== undefined
            && Notification.permission !== 'granted'
            && Notification.permission !== 'denied';
    }

    isPermissionGranted() {
        return this.notificationsAvailable && this.permissionGranted;
    }

    askPermission() {
        if (!this.notificationsAvailable) {
            return new Promise((resolve, reject) => {
                resolve(false);
            });
        }

        this.permissionGranted = Notification !== undefined
            && Notification.permission === 'granted';
        if (this.permissionGranted) {
            this.logger.log('Desktop notification permissions granted');
            return new Promise((resolve, reject) => {
                resolve(true);
            });
        } else if (Notification !== undefined && Notification.permission !== 'denied') {
            return Notification.requestPermission().then(permission => {
                this.logger.log('Desktop notification permissions status updated: ' + permission);
                this.permissionGranted = Notification.permission === 'granted';
                return this.permissionGranted;
            });
        }

        return new Promise((resolve, reject) => {
            resolve(false);
        });
    }

    sendNotification(header: string, body: string, shortBody: string, href: string) {
        if (this.notificationsAvailable && this.permissionGranted && Notification !== undefined) {
            const notification = new Notification(header, {
                body: body
            });
            notification.onclick = (e) => {
                window.location.href = href;
            };
        } else {
            this.alertService.info(shortBody);
        }
    }

}

import { Injectable } from '@angular/core';

import { LoggerService } from './logger.service';

@Injectable({
    providedIn: 'root'
})
export class DesktopNotificationService {
    private permissionGranted: boolean;

    constructor(
        private logger: LoggerService
    ) {
        this.permissionGranted = Notification !== undefined
            && Notification.permission === 'granted';
    }

    askForPermissions() {
        return Notification !== undefined
            && Notification.permission !== undefined
            && Notification.permission !== 'granted'
            && Notification.permission !== 'denied';
    }

    isPermissionGranted() {
        return this.permissionGranted;
    }

    askPermission() {
        this.permissionGranted = Notification.permission === 'granted';
        if (this.permissionGranted) {
            this.logger.log('Desktop notification permissions granted');
            return new Promise((resolve, reject) => {
                resolve(true);
            });
        } else if (Notification.permission !== 'denied') {
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

    sendNotification(header: string, body: string, href: string) {
        if (this.permissionGranted) {
            const notification = new Notification(header, {
                body: body
            });
            notification.onclick = (e) => {
                window.location.href = href;
            };
        } else {
            this.logger.log('Header: ' + header);
            this.logger.log('Body: ' + body);
        }
    }

}

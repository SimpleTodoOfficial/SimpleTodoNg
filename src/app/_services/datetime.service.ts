import { Injectable, OnInit, OnDestroy } from '@angular/core';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';

import { LoggerService } from './logger.service';
import { DateTime, Time } from '../_models';

@Injectable({
    providedIn: 'root'
})
export class DateTimeService implements OnInit, OnDestroy {

    constructor(
        private logger: LoggerService
    ) {
        // Nothing to see here...
    }

    ngOnInit() {
        this.logger.log('Initializing DateTimeService');
    }

    ngOnDestroy() {
        this.logger.log('Destroying DateTimeService');
    }

    get0FilledNumberAsStr(val: number): string {
        return val < 10 ? '0' + val : '' + val;
    }

    dateFromString(str: string): Date {
        var m = str.match(/(\d+)-(\d+)-(\d+)\s+(\d+):(\d+):(\d+)/);
        return new Date(+m[1], +m[2] - 1, +m[3], +m[4], +m[5], +m[6]);
    }

    parseDateTimeFromStr(dueDateStr: string): DateTime {
        let datetime: DateTime = null;
        if (dueDateStr) {
            this.logger.log('Parsing date and time from string "' + dueDateStr + '"');
            let dueDate = this.dateFromString(dueDateStr);
            datetime = new DateTime(dueDate.getDate(), dueDate.getMonth() + 1, dueDate.getFullYear(), dueDate.getHours(), dueDate.getMinutes(), dueDate.getSeconds());
            this.logger.log('Parsing result is:');
            this.logger.log(datetime);
        } else {
            this.logger.log('Due date is empty, not parsing date and time');
        }

        return datetime;
    }

    getDateTimeAsStr(dateValue: NgbDateStruct, timeValue: Time): string {
        // Datetime format in backend validation is "yyyy-mm-dd HH:mm:ss"
        if (dateValue == null && timeValue == null) {
            return null;
        }

        let retStr = '';
        var today = new Date();

        let dd, mm, yyyy;
        if (dateValue != null) {
            this.logger.log('Setting given date');
            dd = this.get0FilledNumberAsStr(dateValue.day);
            mm = this.get0FilledNumberAsStr(dateValue.month);
            yyyy = dateValue.year;
        } else {
            this.logger.log('Setting current date');
            dd = this.get0FilledNumberAsStr(Number(String(today.getDate()).padStart(2, '0')));
            mm = this.get0FilledNumberAsStr(Number(String(today.getMonth() + 1).padStart(2, '0'))); // January is 0
            yyyy = today.getFullYear();
        }
        retStr += yyyy + '-' + mm + '-' + dd + ' ';

        let hours, minutes, seconds;
        if (timeValue != null) {
            this.logger.log('Setting given time');
            hours = this.get0FilledNumberAsStr(timeValue.hour);
            minutes = this.get0FilledNumberAsStr(timeValue.minute);
            seconds = this.get0FilledNumberAsStr(timeValue.second);
        } else {
            this.logger.log('Setting current time + 1 hour');
            hours = this.get0FilledNumberAsStr(today.getHours() + 1);
            minutes = this.get0FilledNumberAsStr(today.getMinutes());
            seconds = this.get0FilledNumberAsStr(today.getSeconds());
        }
        retStr += hours + ':' + minutes + ':' + seconds;

        this.logger.log('Returning date and time result "' + retStr + '"');

        return retStr;
    }

}

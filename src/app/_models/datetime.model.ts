import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { Time } from '../_models';

export class DateTime {
    date: NgbDateStruct;
    time: Time;

    constructor(date: number, month: number, year: number, hour: number, minute: number, second: number) {
        this.date = {
            day: date,
            month: month,
            year: year
        };
        this.time = {
            hour: hour,
            minute: minute,
            second: second
        };
    }
}

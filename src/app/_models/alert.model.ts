import { AlertType } from './alerttype.enum';

export class Alert {
    id: string;
    type: AlertType;
    message: string;
    autoClose: boolean;

    constructor(init?: Partial<Alert>) {
        Object.assign(this, init);
    }

}

import { AlertType } from './alerttype.enum';

export class Alert {
    id: string;
    clearAll: boolean;
    type: AlertType;
    message: string;
    persistent: boolean;
    autoClose: boolean;

    constructor(init?: Partial<Alert>) {
        Object.assign(this, init);
    }

}

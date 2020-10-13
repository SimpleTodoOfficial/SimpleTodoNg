import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'ngbd-modal-confirm',
    templateUrl: 'confirmation.modal.html',
    styleUrls: ['./confirmation.modal.scss']
})
export class ModalConfirm {
    public header: string = '';
    public text: string = '';
    public text2: string = '';
    public textDanger: string = '';

    constructor(public modal: NgbActiveModal) {
        // Nothing to see here...
    }

}

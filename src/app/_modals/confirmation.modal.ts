import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'ngbd-modal-confirm',
    templateUrl: 'confirmation.modal.html',
    styleUrls: ['./confirmation.modal.scss']
})
export class ModalConfirm {
    public header: string = 'Confirm deletion';
    public text: string = 'Please confirm the deletion';
    public text2: string = 'All information associated to this type will be permanently deleted.';
    public textDanger: string = 'This operation can not be made undone.';

    constructor(public modal: NgbActiveModal) {
        // Nothing to see here...
    }

}

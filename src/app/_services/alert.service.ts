import { Injectable } from '@angular/core';

import { ToastrService } from 'ngx-toastr';

@Injectable({
    providedIn: 'root'
})
export class AlertService {
    
    private options = {
        'positionClass': 'toast-top-right',
        'timeOut': 3200,
        'disableTimeOut': false
    }

    constructor(
        private toastr: ToastrService
    ) {
        // Nothing to see here...
    }

    getOptions(_options?: any) {
        var optionsRet = {
            'positionClass': this.options['positionClass'],
            'timeOut': this.options['timeOut'],
            'disableTimeOut': this.options['disableTimeOut']
        }
        if (_options != null && !_options['autoClose']) {
            optionsRet['disableTimeOut'] = true;
            optionsRet['timeOut'] = 0;
            optionsRet['extendedTimeOut'] = 0;
        }

        return optionsRet;
    }

    success(message: string, _options?: any) {
        this.toastr.success(message, null, this.getOptions(_options));
    }

    info(message: string, _options?: any) {
        this.toastr.info(message, null, this.getOptions(_options));
    }

    error(message: string, _options?: any) {
        this.toastr.error(message, null, this.getOptions(_options));
    }

    warn(message: string, _options?: any) {
        this.toastr.warning(message, null, this.getOptions(_options));
    }

    clear(toastId: number) {
        this.toastr.clear(toastId);
    }

    clearAll() {
        this.toastr.clear();
    }

}

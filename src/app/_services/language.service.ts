import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { LoggerService } from './logger.service';
import { environment } from '../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class LanguageService {

    constructor(
        private http: HttpClient,
        private logger: LoggerService
    ) {
        // Nothing to see here...
    }

    getLanguages() {
        let url = `${environment.apiUrl}/${environment.i18nPath.main}/${environment.i18nPath.languages}`;
        this.logger.log('Loading languages, URL: ' + url);

        return this.http.get(url);
    }

    getLanguage(id: string) {
        let url = `${environment.apiUrl}/${environment.i18nPath.main}/${environment.i18nPath.languages}/${id}`;
        this.logger.log('Loading language "' + id + '", URL: ' + url);

        return this.http.get(url);
    }

}

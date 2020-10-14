import { Injectable } from '@angular/core';

import { LoggerService } from './logger.service';

@Injectable({
    providedIn: 'root'
})
export class I18nService {
    private languages;
    private currentLanguage;
    private currentTranslations = { id: '' };

    constructor(
        private logger: LoggerService
    ) {
        // Nothing to see here...
    }

    setLanguages(languages) {
        this.languages = languages;
        return this.loadLanguage();
    }

    setCurrentTranslations(currentTranslations) {
        this.currentTranslations = currentTranslations;
    }

    loadLanguage() {
        this.logger.log('Loading language from localStorage');
        this.currentLanguage = JSON.parse(localStorage.getItem('language'));
        if (!this.currentLanguage) {
            this.logger.log('Could not load language from localStorage');
            this.currentLanguage = 'de-DE';
        }
        this.logger.log('Set language to "' + this.currentLanguage + '"');

        return this.currentLanguage;
    }

    getLanguageInfo() {
        return this.languages;
    }

    translate(key: string, strDefault: string = '', map = {}) {
        let translation = this.currentTranslations[key];
        if (!translation) {
            translation = strDefault;
        }
        const replacements = Object.entries(map);
        if (replacements.length > 0) {
            for (const [key, value] of replacements) {
                translation = translation.replaceAll('%' + key + '%', value);
            }
        }

        return translation;
    }

}

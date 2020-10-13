import { Injectable } from '@angular/core';

import { LoggerService } from './logger.service';

// TODO: Load dynamically when files get bigger
import { i18n_de_DE } from '../_i18n/de-DE';
import { i18n_en_US } from '../_i18n/en-US';

@Injectable({
    providedIn: 'root'
})
export class I18nService {
    private languages = [
        i18n_de_DE,
        i18n_en_US
    ];
    private currentLanguage;
    private currentTranslations;

    constructor(
        private logger: LoggerService
    ) {
        this.loadLanguage();
    }

    loadLanguage() {
        this.logger.log('Loading language from localStorage');
        this.currentLanguage = JSON.parse(localStorage.getItem('language'));
        if (!this.currentLanguage) {
            this.logger.log('Could not load language from localStorage');
            this.currentLanguage = 'de-DE';
        }
        this.switchLanguage(this.currentLanguage);
    }

    switchLanguage(language: string) {
        this.logger.log('Setting language to \"' + language + '\"');
        this.currentTranslations = this.languages.filter(l => l.id === language)[0];
        if (!this.currentTranslations) {
            this.logger.log('Could not find language \"' + language + '\", loading default language');
            this.currentTranslations = this.languages[0];
        }
        localStorage.setItem('language', JSON.stringify(this.currentTranslations.id));
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

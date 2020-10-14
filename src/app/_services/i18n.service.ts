import { Injectable } from '@angular/core';

import { LoggerService } from './logger.service';

@Injectable({
    providedIn: 'root'
})
export class I18nService {
    private languages;
    private currentLanguage;
    private currentTranslations = { id: '' };
    private preferredFallbackLanguageId = 'de-DE';

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
            if (this.languages.length <= 0) {
                this.logger.log('No languages found.');

                return;
            }

            // look for a de-DE language specification
            this.logger.log('Looking for preferred fallback language id "' + this.preferredFallbackLanguageId + '"');
            let deDELangFound = false;
            for (let l in this.languages) {
                if (this.languages[l].id === this.preferredFallbackLanguageId) {
                    deDELangFound = true;
                    break;
                }
            }
            if (deDELangFound) {
                this.logger.log('Preferred language fallback id "' + this.preferredFallbackLanguageId + '" found');
                this.currentLanguage = this.preferredFallbackLanguageId;
            } else {
                this.logger.log('Preferred language fallback id "' + this.preferredFallbackLanguageId + '" not found, falling back');
                this.currentLanguage = this.languages[0].id;
            }
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

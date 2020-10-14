import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { BreakpointObserver } from '@angular/cdk/layout';
import { first } from 'rxjs/operators';
import { Subscription } from 'rxjs';

import { faAddressCard, faHome, faAddressBook, faTh, faSignOutAlt, faUserCircle, faUser, faFlag } from '@fortawesome/free-solid-svg-icons';

import { environment } from './environments/environment';
import { LoggerService, AlertService, UserService, I18nService, LanguageService } from './_services';
import { User } from './_models';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  public loaded: boolean;
  public languagesLoading: boolean;
  public languagesLoaded: boolean;
  public user: User;
  public isAdmin: boolean;
  public isMin: boolean;
  public version = environment.version;
  private ussSub: Subscription;
  private obSub: Subscription;
  private langsSub: Subscription;
  private langSub: Subscription;

  public faAddressCard = faAddressCard;
  public faHome = faHome;
  public faAddressBook = faAddressBook;
  public faTh = faTh;
  public faUserCircle = faUserCircle;
  public faSignOutAlt = faSignOutAlt;
  public faUser = faUser;
  public faFlag = faFlag;

  constructor(
    public i18nService: I18nService,
    public languageService: LanguageService,
    private router: Router,
    private observer: BreakpointObserver,
    private logger: LoggerService,
    private alertService: AlertService,
    private userService: UserService
  ) {
    this.loaded = false;
    this.languagesLoaded = false;

    this.ussSub = this.userService.user.subscribe(x => {
      this.user = x;
      if (this.user) {
        this.isAdmin = this.userService.isAdmin();
        this.loaded = true;
      }
    },
      error => {
        this.logger.error(error);
        this.router.navigate(['/']);
        this.alertService.error(this.i18nService.translate('app.component.error.user.load', 'User could not be loaded.'));
      });

    this.obSub = this.observer.observe(['(min-width: 500px)']).subscribe(result => {
      if (result.matches) {
        this.isMin = result.breakpoints['(min-width: 500px)'];
      } else {
        this.isMin = false;
      }
    });
  }

  ngOnInit() {
    this.logger.log('Initializing AppComponent');

    // To prevent cyclic dependencies, we have to set up langauge and i18n services here
    this.prepareLanguages();
  }

  ngOnDestroy() {
    this.logger.log('Destroying AppComponent');

    if (this.langsSub) {
      this.langsSub.unsubscribe();
    }
    if (this.langSub) {
      this.langSub.unsubscribe();
    }
    if (this.ussSub) {
      this.ussSub.unsubscribe();
    }
    if (this.obSub) {
      this.obSub.unsubscribe();
    }
  }

  prepareLanguages() {
    this.languagesLoading = true;

    if (this.langsSub) {
      this.langsSub.unsubscribe();
    }
    this.langsSub = this.languageService.getLanguages()
      .pipe(first())
      .subscribe(languages => {
        let langs = [];
        for (let key in languages) {
          langs.push({
            id: key,
            name: languages[key]
          });
        }
        this.logger.log('Available languages:');
        this.logger.log(langs);

        let loadLanguage = this.i18nService.setLanguages(langs);

        this.logger.log('Loading language "' + loadLanguage + '"');
        this.setLanguage(loadLanguage);
      },
        error => {
          this.logger.error(error);
          this.languagesLoaded = false;
          this.languagesLoading = false;
          this.alertService.error(this.i18nService.translate('app.component.error.language_load', 'Language information could not be loaded.'));
        });
  }

  setLanguage(language: string) {
    this.logger.log('Setting language to \"' + language + '\"');

    if (this.langSub) {
      this.langSub.unsubscribe();
    }
    this.langSub = this.languageService.getLanguage(language)
      .pipe(first())
      .subscribe(language => {
        this.logger.log('Successfully loaded language');
        this.i18nService.setCurrentTranslations(language);
        this.languagesLoaded = true;
        this.languagesLoading = false;
      },
        error => {
          this.logger.error(error);
          this.languagesLoaded = false;
          this.languagesLoading = false;
          this.alertService.error(this.i18nService.translate('app.component.error.language_load', 'Language translations could not be loaded.'));
        });
    localStorage.setItem('language', JSON.stringify(language));
  }

  signout() {
    this.isAdmin = false;
    this.userService.signout();
    this.alertService.info(this.i18nService.translate('app.component.info.sign_out', 'Signed out successfully'), { autoClose: true });
  }

}

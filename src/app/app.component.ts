import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, NavigationStart } from '@angular/router';
import { BreakpointObserver } from '@angular/cdk/layout';
import { first } from 'rxjs/operators';
import { Subscription } from 'rxjs';

import { faAddressCard, faHome, faAddressBook, faClock, faTh, faSignOutAlt, faUserCircle, faUser, faFlag } from '@fortawesome/free-solid-svg-icons';

import { environment } from './environments/environment';
import { LoggerService, AlertService, UserService, I18nService, LanguageService, EmojiService, DesktopNotificationService } from './_services';
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
  public askDesktopNotificationPermissions: boolean;
  public user: User;
  public isAdmin: boolean;
  public isMin: boolean;
  public version = environment.version;
  public emojiEnabled = environment.emoji;
  public showCurtain: boolean;
  public showEmoji: boolean;
  private ussSub: Subscription;
  private obSub: Subscription;
  private langsSub: Subscription;
  private langSub: Subscription;
  private rtSub: Subscription;
  private dueTodosSub: Subscription;
  private dueTodoRefreshInterval;

  public faAddressCard = faAddressCard;
  public faHome = faHome;
  public faAddressBook = faAddressBook;
  public faTh = faTh;
  public faUserCircle = faUserCircle;
  public faSignOutAlt = faSignOutAlt;
  public faUser = faUser;
  public faFlag = faFlag;
  public faClock = faClock;

  constructor(
    public emojiService: EmojiService,
    public i18nService: I18nService,
    private languageService: LanguageService,
    private router: Router,
    private observer: BreakpointObserver,
    private logger: LoggerService,
    private alertService: AlertService,
    private userService: UserService,
    private desktopNotificationService: DesktopNotificationService
  ) {
    this.loaded = false;
    this.languagesLoaded = false;
    this.showCurtain = true;

    if (this.rtSub) {
      this.rtSub.unsubscribe();
    }
    this.rtSub = this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        this.refreshRandomEmoji();
      }
    });
    if (this.ussSub) {
      this.ussSub.unsubscribe();
    }
    this.ussSub = this.userService.user.subscribe(x => {
      this.user = x;
      if (this.user) {
        this.isAdmin = this.userService.isAdmin();
        this.loaded = true;

        if (this.desktopNotificationService.isPermissionGranted()) {
          this.enableDueTodoRefresh();
        }
      } else {
        clearTimeout(this.dueTodoRefreshInterval);
        if (this.dueTodosSub) {
          this.dueTodosSub.unsubscribe();
        }
      }
    },
      error => {
        this.logger.error(error);
        this.router.navigate(['/']);
        this.alertService.error(this.i18nService.translate('app.component.error.user.load', 'User could not be loaded.'));
      });

    if (this.obSub) {
      this.obSub.unsubscribe();
    }
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

    this.askDesktopNotificationPermissions = this.desktopNotificationService.askForPermissions();

    // To prevent cyclic dependencies, we have to set up langauge and i18n services here
    this.prepareLanguages();
  }

  ngOnDestroy() {
    this.logger.log('Destroying AppComponent');

    clearTimeout(this.dueTodoRefreshInterval);
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
    if (this.dueTodosSub) {
      this.dueTodosSub.unsubscribe();
    }
  }

  refreshDueTodos(logger, userService, desktopNotificationService, i18nService) {
    logger.log('Requesting due Todos');
    if (this.dueTodosSub) {
      this.dueTodosSub.unsubscribe();
    }
    this.dueTodosSub = userService.getDueTodos()
      .pipe(first())
      .subscribe(dueTodos => {
        logger.log('There are currently ' + dueTodos.length + ' due Todos.');
        let url = `/${environment.usersPath.todos.due}`;
        if (dueTodos.length > 0) {
          this.logger.log('Loading last desktop notification time from localStorage');
          let lastTimeStr = JSON.parse(localStorage.getItem('lastdesktopnotification'));
          let display = false;
          if (lastTimeStr) {
            let lastTime = parseInt(JSON.parse(localStorage.getItem('lastdesktopnotification')));
            if ((new Date().getTime() - lastTime) > (60 * 1000)) {
              display = true;
            }
          } else {
            display = true;
          }
          if (display) {
            desktopNotificationService.sendNotification(
              i18nService.translate('duetodos.notification.newduetodos.header', 'Due Todos'),
              i18nService.translate('duetodos.notification.newduetodos.body', 'There are due todos. Click here to get to the overview.'),
              url
            );
            localStorage.setItem('lastdesktopnotification', '' + new Date().getTime());
          }
        }
      },
        error => {
          logger.error(error);
        });
  }

  setUpDesktopNotifications() {
    this.desktopNotificationService.askPermission().then(result => {
      this.askDesktopNotificationPermissions = false;
      if (result) {
        this.logger.log('Setting up due Todo refresh, desktop notifications are enabled');
        this.enableDueTodoRefresh();
      } else {
        this.logger.log('Not setting up due Todo refresh, desktop notifications are not enabled');
      }
    });
  }

  enableDueTodoRefresh() {
    this.refreshDueTodos(this.logger, this.userService, this.desktopNotificationService, this.i18nService);
    clearTimeout(this.dueTodoRefreshInterval);
    this.dueTodoRefreshInterval = setInterval(this.refreshDueTodos, 10 * 60 * 1000,
      this.askDesktopNotificationPermissions, this.logger, this.userService, this.desktopNotificationService, this.i18nService);
  }

  refreshRandomEmoji() {
    if (this.emojiEnabled) {
      this.showEmoji = Math.random() > 0.1;
      if (this.showEmoji) {
        this.emojiService.refreshRandomEmoji();
      }
    } else {
      this.showEmoji = false;
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
          this.showCurtain = false;
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
        this.showCurtain = false;
      },
        error => {
          this.logger.error(error);
          this.languagesLoaded = false;
          this.languagesLoading = false;
          this.showCurtain = false;
          this.alertService.error(this.i18nService.translate('app.component.error.language_load', 'Language translations could not be loaded.'));
        });
    localStorage.setItem('language', JSON.stringify(language));
  }

  signout() {
    this.isAdmin = false;
    this.userService.signout();

    clearTimeout(this.dueTodoRefreshInterval);
    if (this.dueTodosSub) {
      this.dueTodosSub.unsubscribe();
    }
    this.alertService.info(this.i18nService.translate('app.component.info.sign_out', 'Signed out successfully'), { autoClose: true });
  }

}

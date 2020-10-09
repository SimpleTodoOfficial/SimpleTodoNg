import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { BreakpointObserver } from '@angular/cdk/layout';

import { faAddressCard, faHome, faAddressBook, faTh, faSignOutAlt, faUserCircle, faUser } from '@fortawesome/free-solid-svg-icons';

import { environment } from './environments/environment';
import { LoggerService, AlertService, UserService } from './_services';
import { User } from './_models';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  public loaded: boolean;
  public user: User;
  public isAdmin: boolean;
  public isMin: boolean;
  public version = environment.version;
  private ussSub: Subscription;
  private obSub: Subscription;

  public faAddressCard = faAddressCard;
  public faHome = faHome;
  public faAddressBook = faAddressBook;
  public faTh = faTh;
  public faUserCircle = faUserCircle;
  public faSignOutAlt = faSignOutAlt;
  public faUser = faUser;

  constructor(
    private router: Router,
    private observer: BreakpointObserver,
    private logger: LoggerService,
    private alertService: AlertService,
    private userService: UserService
  ) {
    this.loaded = false;

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
        this.alertService.error('User could not be loaded.');
      });

    this.obSub = this.observer.observe(['(min-width: 480px)']).subscribe(result => {
      if (result.matches) {
        this.isMin = result.breakpoints['(min-width: 480px)'];
      } else {
        this.isMin = false;
      }
    });
  }

  ngOnInit() {
    this.logger.log('Initializing AppComponent');
  }

  ngOnDestroy() {
    this.logger.log('Destroying AppComponent');

    if (this.ussSub) {
      this.ussSub.unsubscribe();
    }
    if (this.obSub) {
      this.obSub.unsubscribe();
    }
  }

  signout() {
    this.isAdmin = false;
    this.userService.signout();
    this.alertService.info('Signed out successfully', { autoClose: true });
  }

}

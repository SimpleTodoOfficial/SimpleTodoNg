import { Injectable, OnInit, OnDestroy } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class LoggerService implements OnInit, OnDestroy {

  constructor() {
    // Nothing to see here...
  }

  ngOnInit() {
      this.log('Initializing LoggerService');
  }

  ngOnDestroy() {
      this.log('Destroying LoggerService');
  }

  log(msg: any) {
    var args = Array.prototype.slice.call(arguments);
    args.unshift("[STD]");
    console.log.apply(console, args);
  }

  error(msg: any) {
    var args = Array.prototype.slice.call(arguments);
    args.unshift("[STD]");
    console.error.apply(console, args);
  }

  warn(msg: any) {
    var args = Array.prototype.slice.call(arguments);
    args.unshift("[STD]");
    console.warn.apply(console, args);
  }

}

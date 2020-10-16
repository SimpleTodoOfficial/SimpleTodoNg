import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class LoggerService {

  constructor() {
    // Nothing to see here...
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

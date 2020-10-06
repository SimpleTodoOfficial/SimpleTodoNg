import { Injectable, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { LoggerService } from './logger.service';
import { environment } from '../environments/environment';
import { User, ForgotPassword } from '../_models';

@Injectable({
    providedIn: 'root'
})
export class UserService implements OnInit, OnDestroy {
    private userSubject: BehaviorSubject<User>;
    public user: Observable<User>;

    constructor(
        private router: Router,
        private http: HttpClient,
        private logger: LoggerService
    ) {
        this.userSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('user')));
        this.user = this.userSubject.asObservable();
    }

    ngOnInit() {
        this.logger.log('Initializing UserService');
    }

    ngOnDestroy() {
        this.logger.log('Destroying UserService');
    }

    public get userValue(): User {
        return this.userSubject.value;
    }

    signin(username, password) {
        let url = `${environment.apiUrl}/${environment.authPath.main}/${environment.authPath.signin}`;
        this.logger.log('Signing in user, URL: ' + url);
        return this.http.post<User>(url, { username, password })
            .pipe(map(user => {
                localStorage.setItem('user', JSON.stringify(user));
                this.userSubject.next(user);

                return user;
            }));
    }

    signout() {
        this.logger.log('Signing out user');
        localStorage.removeItem('user');
        this.userSubject.next(null);
        this.router.navigate(['/account/signin']);
    }

    signup(user: User) {
        let url = `${environment.apiUrl}/${environment.authPath.main}/${environment.authPath.signup}`;
        this.logger.log('Signing up user, URL: ' + url);

        return this.http.post(url, user);
    }

    forgotPassword(forgotPassword: ForgotPassword) {
        let url = `${environment.apiUrl}/${environment.usersPath.main}/${environment.usersPath.password.main}/${environment.usersPath.password.forgot}`;
        this.logger.log('Processing forgot password, URL: ' + url);

        return this.http.post(url, forgotPassword);
    }

    resetPassword(token: string) {
        let url = `${environment.apiUrl}/${environment.usersPath.main}/${environment.usersPath.password.main}/${environment.usersPath.password.reset}/${token}`;
        this.logger.log('Processing reset password, URL: ' + url);

        return this.http.put(url, null);
    }

    getAll() {
        let url = `${environment.apiUrl}/${environment.usersPath.main}`;
        this.logger.log('Getting all users, URL: ' + url);

        return this.http.get<User[]>(url);
    }

    getById(id: string) {
        let url = `${environment.apiUrl}/${environment.usersPath.main}/${id}`;
        this.logger.log('Getting user, URL: ' + url);

        return this.http.get<User>(url);
    }

    update(id, params) {
        let url = `${environment.apiUrl}/${environment.usersPath.main}/${id}`;
        this.logger.log('Updating user, URL: ' + url);
        return this.http.put(url, params)
            .pipe(map(x => {
                if (id == this.userValue.id) {
                    this.signout();
                }

                return x;
            }));
    }

    delete(id: string) {
        let url = `${environment.apiUrl}/${environment.usersPath.main}/${id}`;
        this.logger.log('Deleting user, URL: ' + url);
        return this.http.delete(url)
            .pipe(map(x => {
                if (id == this.userValue.id) {
                    this.signout();
                    return null;
                }

                return 'OK';
            }));
    }

    getUser() {
        return this.userValue;
    }

    isLoggedIn() {
        return this.userValue && this.userValue.token;
    }

    isAdmin() {
        if (this.isLoggedIn()) {
            return this.userValue.roles.includes("ADMIN");
        }
    }

}

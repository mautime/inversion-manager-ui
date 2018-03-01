import { Injectable, Injector } from "@angular/core";
import { Observable } from "rxjs/Observable";
import * as jwt_decode from 'jwt-decode';
import { HttpClient } from "@angular/common/http";
import { map, switchMap, tap, catchError } from "rxjs/operators";
import { MatMenu } from "@angular/material";
import { BehaviorSubject } from "rxjs/BehaviorSubject";
import { Subscriber } from "rxjs/Subscriber";
import { ErrorObservable } from "rxjs/observable/ErrorObservable";

@Injectable()
export class AuthorizationService {
    private authenticatedFlag: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

    static injector: Injector;

    constructor(private http: HttpClient, injector: Injector){
        AuthorizationService.injector = injector;
        this.authenticatedFlag.next(this.isAuthenticated());
    }

    login(username: string, password: string): Observable<any> {
        let formData: FormData = new FormData();

        formData.append('username', username);
        formData.append('password', password);
        formData.append('grant_type', 'password');
        
        return this.http.post('/oauth/token', `username=${username}&password=${password}&grant_type=password`, {
            headers: {"Content-type": "application/x-www-form-urlencoded; charset=utf-8", 'Authorization': 'Basic ' + btoa('InversionManagerClientSimple:supersecret')}
        }).pipe(tap(response => {
            this.authenticatedFlag.next(true);

            localStorage.setItem('authorization', JSON.stringify(response));

            return response;
        }), catchError((error, caught) => {
            this.authenticatedFlag.next(false);

            return ErrorObservable.create(error);
        }));
    }

    logout(): Observable<any> {
        this.authenticatedFlag.next(false);

        localStorage.removeItem('authorization');
        return Observable.create(subscriber => {
            subscriber.next('success');
        })
    }
    
    refreshToken(): Observable<any> {
        return this.http.post('/oauth/token', null, {
            params: {refresh_token: this.getRefreshToken(), grant_type: 'refresh_token'}, 
            headers: {"Content-type": "application/x-www-form-urlencoded; charset=utf-8", 'Authorization': 'Basic ' + btoa('InversionManagerClientSimple:supersecret')}
        }).pipe(tap(authorization => {
            this.authenticatedFlag.next(true);
            localStorage.setItem('authorization', JSON.stringify(authorization));
            return authorization;
        }), catchError((error, caught) => {
            this.authenticatedFlag.next(false);
            return ErrorObservable.create(error);
        }));
    }

    authenticated(): Observable<boolean> {
        return this.authenticatedFlag.asObservable();
    }
    getAccessToken(): any {
        return this._getAuthorization()['access_token'];
    }

    getRefreshToken(): any {
        return this._getAuthorization()['refresh_token'];
    }

    isAuthenticated(): boolean {
        return !this.isAccessTokenExpired();
    }

    isAccessTokenExpired(): boolean {
        return this._isTokenExpired(this.getAccessToken());
    }

    isRefreshTokenExpired(): boolean {
        return this._isTokenExpired(this.getRefreshToken());
    }

    getTokenExpirationDate(token: string): Date {
        const decoded = jwt_decode(token);

        if (decoded.exp === undefined) return null;

        const date = new Date(0); 
        date.setUTCSeconds(decoded.exp);
        return date;
    }

    private _isTokenExpired(token: string): boolean {
        //if(!token) token = this.getAccessToken();
        if(!token) return true;

        const date = this.getTokenExpirationDate(token);
        if(date === undefined) return false;
        return !(date.valueOf() > new Date().valueOf());
    }

    private _getAuthorization(): any{
        let authorization: any = localStorage.getItem('authorization');
        let result = {};

        if (authorization){
            result = JSON.parse(authorization)
        }
        
        return result || {};
    }
}
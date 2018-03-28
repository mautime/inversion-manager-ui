import { Injectable, Injector } from "@angular/core";
import { Observable } from "rxjs/Observable";
import * as jwt_decode from 'jwt-decode';
import { HttpClient } from "@angular/common/http";
import { map, switchMap, tap, catchError, filter, take } from "rxjs/operators";
import { MatMenu } from "@angular/material";
import { BehaviorSubject } from "rxjs/BehaviorSubject";
import { Subscriber } from "rxjs/Subscriber";
import { ErrorObservable } from "rxjs/observable/ErrorObservable";
import { Router } from "@angular/router";
import * as auth0 from 'auth0-js';
import { ProfileService } from "./profile.service";

@Injectable()
export class AuthorizationService {

    private authenticatedFlag: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    private waitForProfile = new BehaviorSubject<any>(null);

    auth0 = new auth0.WebAuth({
        clientID: 'uP1HNuJPu6Jb1gYdOK6G0ol8lX3DSEDn',
        domain: 'mautime.auth0.com',
        responseType: 'token id_token code',
        //audience: 'https://mautime.auth0.com/userinfo',
        audience: 'http://localhost:8080/inversion-manager', 
        redirectUri: 'http://localhost:4200/callback',
        //redirectUri: 'http://ec2-18-188-160-213.us-east-2.compute.amazonaws.com/callback',
        scope: 'openid profile email offline_access'
      });
    
      constructor(public router: Router, private profileService: ProfileService) {
        this.authenticatedFlag.next(this.isAuthenticated());
      }

      public handleAuthentication(): void {
        this.auth0.parseHash((err, authResult) => {
          if (authResult && authResult.accessToken && authResult.idToken) {
            this.setSession(authResult);

            this.getProfile().subscribe(profile => {
                this.profileService.exists(profile.sub).subscribe(exists => {

                    if (!exists){
                        this.profileService.register({username: profile.sub, firstName: profile.given_name, lastName: profile.family_name}).subscribe(response => {
                            alert('User registered');
                            this.router.navigate(['/home']);
                        });
                    } else {
                        this.router.navigate(['/home']);
                    }

                })
            });
            //this.router.navigate(['/home']);
          } else if (err) {
            this.router.navigate(['/home']);
            console.log(err);
            alert(`Error: ${err.error}. Check the console for further details.`);
          }
        });
      }

      public login(): void {
        this.auth0.authorize();
      }

    public logout(): Observable<any> {
        // Remove tokens and expiry time from localStorage
        /*localStorage.removeItem('access_token');
        localStorage.removeItem('id_token');
        localStorage.removeItem('expires_at');
        this.authenticatedFlag.next(false);
        */
        this.authenticatedFlag.next(false);
        localStorage.removeItem('authorization');
        localStorage.removeItem('profile');
        return Observable.create(subscriber => {
            subscriber.next({loggedOut: true});
            subscriber.complete();
        });
    }

    public refreshToken(): Observable<any> {
        this.authenticatedFlag.next(false);

        return Observable.create(subscriptor => {
            this.auth0.checkSession({}, (err, result) => {
                if (err) {
                    console.log('Error renewing token');
                    console.log(err);
                    subscriptor.error(err);
                } else {
                    console.log('Token has been successfully renewed');
                    this.setSession(result);
                    subscriptor.next(result);
                }

                subscriptor.complete();
            });
        });
    }

    private setSession(authResult): void {
    // Set the time that the access token will expire at
    /*const expiresAt = JSON.stringify((authResult.expiresIn * 1000) + new Date().getTime());
    localStorage.setItem('access_token', authResult.accessToken);
    localStorage.setItem('id_token', authResult.idToken);
    localStorage.setItem('expires_at', expiresAt);*/
    //this.authenticatedFlag.next(true);

    localStorage.setItem('authorization', JSON.stringify(authResult));
    this.authenticatedFlag.next(true);

    this.setProfile();
    }

    public isAuthenticated(): boolean {
    // Check whether the current time is past the
    // access token's expiry time
        /*const expiresAt = JSON.parse(localStorage.getItem('expires_at'));
        console.log('EXPIRES AT');
        console.log(new Date().setTime(expiresAt));
        return new Date().getTime() < expiresAt;*/
        return !this.isAccessTokenExpired();
    }

    public isAuthenticatedAsObservable(): Observable<boolean> {
        return this.authenticatedFlag.asObservable();
    }

    getAccessToken(): any {
        return this._getAuthorization()['accessToken'];
    }
    
    setProfile(): void {
        this.waitForProfile.next(null);

        if (!this.getAccessToken()){
            throw new Error('Access Token must exist to fetch profile');
        } else {

            this.auth0.client.userInfo(this.getAccessToken(), (error, profile) => {
                if (profile){
                    let profileJson = JSON.stringify(profile);

                    localStorage.setItem('profile', profileJson);
                    this.waitForProfile.next(profile);
                }
            });
        }
    }

    getProfile(): Observable<any> {
        let profile = null;

        profile = localStorage.getItem('profile');

        if (profile){
            console.log('THERE IS A PROFILE');
            console.log(profile);

            return Observable.create(subscriptor => {
                subscriptor.next(JSON.parse(profile));
                //subscriptor.complete();
                
            });
        } else {

            return this.waitForProfile.pipe(filter(p => p != null), take(1), switchMap(p => {

                return Observable.create(subscriptor => {
                    subscriptor.next(p);
                    //subscriptor.complete();
                    
                });
    
            }));
        }
    }

    isAccessTokenExpired(): boolean {
        return this._isTokenExpired(this.getAccessToken());
    }

    private _getAuthorization(): any {
        let authorization: any = localStorage.getItem('authorization');
        let result = {};

        if (authorization){
            result = JSON.parse(authorization)
        }
        
        return result || {};
    }

    private _isTokenExpired(token: string): boolean {
        //if(!token) token = this.getAccessToken();
        if(!token) return true;

        const date = this._getTokenExpirationDate(token);
        if(date === undefined) return false;
        return !(date.valueOf() > new Date().valueOf());
    }

    private _getTokenExpirationDate(token: string): Date {
        const decoded = jwt_decode(token);

        if (decoded.exp === undefined) return null;

        const date = new Date(0); 
        date.setUTCSeconds(decoded.exp);

        console.log('TOKEN EXPIRATION DATE');
        console.log(date);
        return date;
    }
    /*
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
    }*/
}
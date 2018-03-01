import { HttpInterceptor, HttpEvent, HttpHandler, HttpRequest, HttpErrorResponse } from "@angular/common/http";
import { Observable } from "rxjs/Observable";
import { Injectable } from "@angular/core";
import { AuthorizationService } from "./services/auth.service";
import { BehaviorSubject } from "rxjs/BehaviorSubject";
import { catchError, switchMap, finalize, filter, take } from "rxjs/operators";
import { ErrorObservable } from "rxjs/observable/ErrorObservable";

@Injectable()
export class AuthorizationInterceptor implements HttpInterceptor {
    private refreshingToken: boolean;
    private tokenSubject: BehaviorSubject<string> = new BehaviorSubject<string>(null);

    constructor(private authorizationService: AuthorizationService){}

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        let token = this.authorizationService.getAccessToken();
        let clonedRequest = request;

        //console.log('AuthorizationInterceptor#intercept');
        //console.log(token);
        if (request.url.startsWith('http://localhost:8080/api')){
            clonedRequest = request.clone({
                headers: request.headers.set('Authorization', 'Bearer ' + token)
            });

            return next.handle(clonedRequest).pipe(catchError((error, caught) => {

                if (error instanceof HttpErrorResponse){
                    
                    switch((<HttpErrorResponse> error).status){
                        case 401:
                            return this.handle401(request, next);
                    }

                } else {
                    return Observable.throw(error);
                }
                
            }));
        }

        return next.handle(request);
    }

    handle401(request: HttpRequest<any>, next: HttpHandler) {

        if (!this.refreshingToken){
            this.refreshingToken = true;

            this.tokenSubject.next(null);
            
            return this.authorizationService.refreshToken().pipe(switchMap(authorization => {
                
                if (this.authorizationService.isAuthenticated()){
                    this.tokenSubject.next(this.authorizationService.getAccessToken());

                    return next.handle(request.clone({
                        headers: request.headers.set('Authorization', 'Bearer ' + this.authorizationService.getAccessToken())
                    }));
                }

                return ErrorObservable.create("No Authorization Token Received");
            }), catchError((error, caught) => {
                return ErrorObservable.create(error);
            }), finalize(() => {
                this.refreshingToken = false;
            }));
        } else {
            return this.tokenSubject.pipe(filter(token => {console.log('TOKEN SUBJECT - FILTER');console.log(token); return token != null;}), take(1), switchMap(token => {
                console.log('TOKEN SUBJECT - SWITCH MAP');
                console.log(token);
                return next.handle(request.clone({
                    headers: request.headers.set('Authorization', 'Bearer ' + token)
                }));
            }))
        }
    }
}
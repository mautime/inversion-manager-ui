import { HttpInterceptor, HttpEvent, HttpHandler, HttpRequest, HttpErrorResponse } from "@angular/common/http";
import { Observable } from "rxjs/Observable";
import { Injectable } from "@angular/core";
import { AuthorizationService } from "./services/auth.service";
import { BehaviorSubject } from "rxjs/BehaviorSubject";
import { catchError, switchMap, finalize, filter, take } from "rxjs/operators";
import { ErrorObservable } from "rxjs/observable/ErrorObservable";
import { AppModule } from "./app.module";

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
        if (request.url.startsWith('/api') && !request.url.startsWith('/api/data/coinlist')){
            clonedRequest = request.clone({
                //url: 'http://ec2-18-188-47-234.us-east-2.compute.amazonaws.com:8080' + request.url, 
                //url: 'http://NXL90734.am.freescale.net:8080' + request.url, 
                url: 'http://localhost:8080' + request.url, 
                headers: request.headers.set('Authorization', 'Bearer ' + token)
            });

        } else if (request.url.startsWith('/oauth')){
            clonedRequest = request.clone({
                //url: 'http://ec2-18-188-47-234.us-east-2.compute.amazonaws.com:9090' + request.url
                url: 'http://localhost:9090' + request.url
            });
        }

        if (clonedRequest){

            return next.handle(clonedRequest).pipe(catchError((error, caught) => {
                
                if (error instanceof HttpErrorResponse){
                    
                    switch((<HttpErrorResponse> error).status){
                        case 401:
                            return this.handle401(clonedRequest, next);
                    }

                } else {
                    return Observable.throw(error);
                }
                
            }));
        } else {
            return next.handle(request);
        }
    }

    handle401(request: HttpRequest<any>, next: HttpHandler) {
        if (!this.refreshingToken){
            this.refreshingToken = true;

            this.tokenSubject.next(null);
            
            return this.authorizationService.refreshToken().pipe(switchMap(authorization => {
                console.log('ENTER');
                console.log(this.authorizationService.isAuthenticated());
                if (this.authorizationService.isAuthenticated()){
                    console.log('REFRESH TOKEN');
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
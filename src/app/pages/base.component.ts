import { Component, Inject, Injector } from "@angular/core";
import { MatSnackBar, MatSnackBarModule, MatSnackBarContainer } from "@angular/material";
import { Directionality } from "@angular/cdk/bidi";
import { Message } from "../model/message.model";
import { ErrorMessage } from "../model/error-message.model";
import { SuccessMessage } from "../model/success-message.model";
import { AuthorizationService } from "../services/auth.service";
import { Observable } from "rxjs/Observable";
import { BehaviorSubject } from "rxjs/BehaviorSubject";
import { UtilService } from "../services/util.service";

@Component({
    selector: 'base-component', 
    template: ''
})
export class BaseComponent {
    authService: AuthorizationService;

    private isAuthenticated$: Observable<boolean>;

    constructor(private snackBar: MatSnackBar){
        this.authService = UtilService.injector.get(AuthorizationService);

        this.isAuthenticated$ = this.authService.authenticated();
    }
    
    showMessage(message: Message){
        var messageClass;

        switch(message.type){
            case 'SUCCESS':
                messageClass = 'success-message-panel';
            break;
            case 'ERROR':
                messageClass = 'error-message-panel';
            break;
            default: 
                messageClass = 'info-message-panel';
        }

        this.snackBar.open(message.text, '', {
            duration: 5000, 
            panelClass: messageClass
        });
    }

    showSuccessMessage(message: SuccessMessage){
        message = message || new SuccessMessage('Success');

        this.showMessage(message)
    }

    showErrorMessage(message: ErrorMessage){
        message = message || new ErrorMessage('Error');

        this.showMessage(message)
    }
}
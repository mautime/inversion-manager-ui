import { OnInit, Component } from "@angular/core";
import { AuthorizationService } from "../../services/auth.service";
import { Router } from "@angular/router";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { BaseComponent } from "../base.component";
import { MatSnackBar } from "@angular/material";
import { ErrorMessage } from "../../model/error-message.model";

@Component({
    selector: 'login', 
    templateUrl: './login.component.html'
})
export class LoginComponent extends BaseComponent implements OnInit {

    constructor(private router: Router, snackBar: MatSnackBar){
        super(snackBar);
    }

    credentials: any = {};
    loginFormGroup: FormGroup;

    ngOnInit(){
        console.log('LoginComponent#ngOnInit');

        this.loginFormGroup = new FormGroup({
            usernameInput: new FormControl('', [
                Validators.required
            ]), 
            passwordInput: new FormControl('', [
                Validators.required
            ])
        });
    }

    login() {

        if (this.loginFormGroup.valid){
            this.authService.login(this.credentials.username, this.credentials.password).subscribe(response => {
                this.router.navigate(['/home']);
            }, error => {
                console.log(error);
                let errorMessage = 'Unknown Exception';

                if (error.status == 400){
                    errorMessage = 'Invalid Credentials';
                }

                this.showErrorMessage(new ErrorMessage(errorMessage));
            });
        }
    }
}
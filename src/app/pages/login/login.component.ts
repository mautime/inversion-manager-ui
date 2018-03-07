import { OnInit, Component, ViewChild } from "@angular/core";
import { AuthorizationService } from "../../services/auth.service";
import { Router } from "@angular/router";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { BaseComponent } from "../base.component";
import { MatSnackBar, MatTabGroup } from "@angular/material";
import { ErrorMessage } from "../../model/error-message.model";
import { ProfileService } from "../../services/profile.service";
import { Observable } from "rxjs/Observable";
import { SuccessMessage } from "../../model/success-message.model";

@Component({
    selector: 'login', 
    templateUrl: './login.component.html'
})
export class LoginComponent extends BaseComponent implements OnInit {
    private vm = this;
    private credentials: any = {};
    private profile: any;
    private loginFormGroup: FormGroup;

    @ViewChild(MatTabGroup)
    private tabGroup: MatTabGroup;

    constructor(private router: Router, private profileService: ProfileService, snackBar: MatSnackBar){
        super(snackBar);
    }

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

        this.tabGroup.selectedTabChange.subscribe(tab => {

            if (tab.index == 1){
                this.profile = {};
            } else {
                this.profile = undefined;
            }
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

    checkExisting = (email: string) => {
        console.log('TEST');
        console.log(email);
        return this.profileService.exists(email);
    };

    register(params) {
        console.log(params);
        this.profileService.register(params.model).subscribe(response => {
            console.log(response);

            this.authService.login(params.model.email, params.model.password).subscribe(response => {
                this.router.navigate(['/home']);
            }, error => {
                console.log(error);
                let errorMessage = 'Unknown Exception';

                this.showErrorMessage(new ErrorMessage(errorMessage));
            });
        });
    }
}
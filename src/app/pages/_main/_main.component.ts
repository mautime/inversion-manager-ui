import { OnInit, Component, ChangeDetectorRef, ViewChild } from "@angular/core";
import { AuthorizationService } from "../../services/auth.service";
import { Router } from "@angular/router";
import { BaseComponent } from "../base.component";
import { MatSnackBar, MatSidenav } from "@angular/material";
import {MediaMatcher} from '@angular/cdk/layout';
import { Observable } from "rxjs/Observable";

@Component({
    selector: 'main', 
    templateUrl: './_main.component.html', 
    styleUrls: ['_main.component.css']
})
export class MainComponent extends BaseComponent implements OnInit{

    mobileQuery: MediaQueryList;

    profile: any;

    @ViewChild('sideNav')
    sideNav: MatSidenav;

    constructor(private router: Router, changeDetectorRef: ChangeDetectorRef, media: MediaMatcher, public auth: AuthorizationService, snackBar: MatSnackBar){
        super(snackBar);
        this.mobileQuery = media.matchMedia('(max-width: 600px)');
        this._mobileQueryListener = () => changeDetectorRef.detectChanges();
        this.mobileQuery.addListener(this._mobileQueryListener);

        auth.handleAuthentication();

        this.authService.getProfile().subscribe(profile => {
            this.profile = profile;
        });
    }
    
    ngOnInit(){
        console.log('MainComponent#ngOnInit');
    }

    ngOnDestroy(): void {
        this.mobileQuery.removeListener(this._mobileQueryListener);
    }

    login() {
        this.authService.login();
    }

    logout() {
        this.authService.logout().subscribe(response => {
            console.log('LOGGED OUT');
            console.log(response);
            this.router.navigate(['/landing']);
        });
    }

    toggleSideNav() {
        this.sideNav.toggle();
    }
    private _mobileQueryListener: () => void;
}
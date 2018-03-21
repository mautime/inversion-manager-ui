import { OnInit, Component } from "@angular/core";
import { AuthorizationService } from "../../services/auth.service";
import { Router } from "@angular/router";

@Component({
    selector: 'landing', 
    templateUrl: './landing.component.html'
})
export class LandingComponent implements OnInit {
    constructor(private authService: AuthorizationService, private router: Router){}

    ngOnInit(){
        console.log('LandingComponent#ngOnInit');

        if (this.authService.isAuthenticated()){
            this.router.navigate(['/home']);
        }
    }
}
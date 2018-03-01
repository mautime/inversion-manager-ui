import { OnInit, Component } from "@angular/core";
import { AuthorizationService } from "../../services/auth.service";
import { Router } from "@angular/router";
import { BaseComponent } from "../base.component";
import { MatSnackBar } from "@angular/material";

@Component({
    selector: 'main', 
    templateUrl: './_main.component.html', 
    styleUrls: ['_main.component.css']
})
export class MainComponent extends BaseComponent implements OnInit{
    constructor(private router: Router, snackBar: MatSnackBar){
        super(snackBar);
    }
    
    ngOnInit(){
        console.log('MainComponent#ngOnInit');
    }

    logout(){
        this.authService.logout().subscribe(response => {
            this.router.navigate(['/login']);
        });
    }
}
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from "@angular/router";
import { AuthorizationService } from "./auth.service";
import { Injectable } from "@angular/core";

@Injectable()
export class AuthorizationRouteActivatorService implements CanActivate {
    constructor(private authService: AuthorizationService, private router: Router){}

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        console.log('AuthorizationRouteActivatorService#canActivate');
        
        if (this.authService.isAuthenticated() || !this.authService.isRefreshTokenExpired()){
            return true;
        } else {
            this.router.navigate(['/login']);
            return false;
        }
    }
}
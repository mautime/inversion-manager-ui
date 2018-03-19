import { RouterModule, Routes } from '@angular/router';
import {HomeComponent} from './pages/home/home.component';
import { ExchangeTransactionComponent } from './pages/exchange-transaction/exchange-transaction.component';
import { AuthorizationRouteActivatorService } from './services/auth-route-activator.service';
import { LoginComponent } from './pages/login/login.component';
import { ExchangeTransactionListComponent } from './pages/exchange-transaction/exchange-transaction-list.component';

const routes: Routes = [{
    path: 'login', 
    component: LoginComponent
}, {
    path: 'home', 
    component: HomeComponent, 
    canActivate: [AuthorizationRouteActivatorService]
}, {
    path: 'exchange-transactions', 
    canActivate: [AuthorizationRouteActivatorService], 
    children: [{
        path: '', 
        component: ExchangeTransactionListComponent
    }, {
        path: ':id', 
        component: ExchangeTransactionComponent
    }, {
        path: 'add', 
        component: ExchangeTransactionComponent
    }]
}, {
    path: '', 
    redirectTo: '/home', 
    pathMatch: 'full', 
    canActivate: [AuthorizationRouteActivatorService]
}];

export const routesModule = RouterModule.forRoot(routes, {useHash: false});
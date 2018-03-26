import { RouterModule, Routes } from '@angular/router';
import {HomeComponent} from './pages/home/home.component';
import { ExchangeTransactionComponent } from './pages/exchange-transaction/exchange-transaction.component';
import { AuthorizationRouteActivatorService } from './services/auth-route-activator.service';
import { ExchangeTransactionListComponent } from './pages/exchange-transaction/exchange-transaction-list.component';
import { CallbackComponent } from './pages/callback/callback.component';
import { LandingComponent } from './pages/landing/landing.component';

const routes: Routes = [{
    path: 'landing', 
    component: LandingComponent
}, {
    path: 'home', 
    component: HomeComponent, 
    data: {
        title: 'Dashboard'
    }, 
    canActivate: [AuthorizationRouteActivatorService]
}, {
    path: 'exchange-transactions', 
    data: {
        title: 'Exchange Transaction'
    }, 
    canActivate: [AuthorizationRouteActivatorService], 
    children: [{
        path: '', 
        component: ExchangeTransactionListComponent, 
        data: {
            title: 'Search'
        }
    }, {
        path: 'add', 
        component: ExchangeTransactionComponent, 
        data: {
            title: 'Add'
        }
    }]
}, {
    path: 'callback', component: CallbackComponent 
}, {
    path: '', 
    redirectTo: '/landing', 
    pathMatch: 'full', 
    //canActivate: [AuthorizationRouteActivatorService]
}];

export const routesModule = RouterModule.forRoot(routes, {useHash: false});
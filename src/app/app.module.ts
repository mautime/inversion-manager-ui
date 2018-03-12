import { BrowserModule } from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { NgModule, Injector, Injectable } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FlexLayoutModule } from '@angular/flex-layout';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import {
  MatToolbarModule,
  MatIconModule, 
  MatFormFieldModule, 
  MatInputModule, 
  MatSelectModule, 
  MatSlideToggleModule, 
  MatButtonModule, 
  MatTableModule, 
  MatPaginatorModule,
  MatSnackBarModule, 
  MatListModule, 
  MatCardModule, 
  MatGridListModule, 
  MatDividerModule, 
  MatSidenavModule, 
  MatDatepickerModule, 
  NativeDateModule,
  MatNativeDateModule, 
  MatAutocompleteModule, 
  MatTabsModule,
  MatMenuModule, 
  MatSortModule
} from '@angular/material';

import { AuthorizationInterceptor } from './app.interceptors';

import {ExchangeTransactionFormComponent} from './components/exchange-transaction-form/exchange-transaction-form.component';
import {MainComponent} from './pages/_main/_main.component';
import {LoginComponent} from './pages/login/login.component';
import {HomeComponent} from './pages/home/home.component';
import { ExchangeTransactionComponent } from './pages/exchange-transaction/exchange-transaction.component';

import {DataCatalogService} from './services/data-catalog.service';
import { ExchangeTransactionManagerService } from './services/exchange-transaction.service';

import {routesModule} from './app.routes';
import { BaseComponent } from './pages/base.component';
import { CryptoCoinService } from './services/crypto-coin.service';
import { Observable } from 'rxjs/Observable';
import { AuthorizationService } from './services/auth.service';
import { AuthorizationRouteActivatorService } from './services/auth-route-activator.service';
import { ExchangeTransactionSellFormComponent } from './components/exchange-transaction-form/exchange-transaction-sell-form.component';
import { ExchangeTransactionBuyFormComponent } from './components/exchange-transaction-form/exchange-transaction-buy-form.component';
import { TypeaheadService } from './services/typeahead.service';
import { UtilService } from './services/util.service';
import { ExchangeTransactionListComponent } from './pages/exchange-transaction/exchange-transaction-list.component';
import { ProfileService } from './services/profile.service';
import { ProfileFormComponent } from './components/profile/profile-form.component';

@NgModule({
  declarations: [
    BaseComponent, 
    MainComponent, 
    LoginComponent, 
    HomeComponent, 
    ExchangeTransactionComponent, 
    ExchangeTransactionListComponent, 
    ExchangeTransactionFormComponent, 
    ExchangeTransactionBuyFormComponent, 
    ExchangeTransactionSellFormComponent, 
    ProfileFormComponent
  ],
  imports: [
    BrowserModule, 
    BrowserAnimationsModule, 
    HttpClientModule, 
    FlexLayoutModule, 
    FormsModule, 
    ReactiveFormsModule, 
    MatToolbarModule, 
    MatIconModule, 
    MatFormFieldModule, 
    MatInputModule, 
    MatSelectModule, 
    MatSlideToggleModule, 
    MatButtonModule, 
    MatTableModule, 
    MatPaginatorModule, 
    MatSnackBarModule, 
    MatListModule, 
    MatCardModule, 
    MatGridListModule, 
    MatDividerModule, 
    MatSidenavModule, 
    MatDatepickerModule, 
    MatNativeDateModule, 
    MatTabsModule, 
    MatAutocompleteModule, 
    MatMenuModule, 
    MatSortModule
    routesModule
  ], 
  providers: [UtilService, DataCatalogService, CryptoCoinService, TypeaheadService,ExchangeTransactionManagerService, ProfileService, AuthorizationService, AuthorizationRouteActivatorService, {provide: HTTP_INTERCEPTORS, useClass: AuthorizationInterceptor, multi: true}],
  bootstrap: [MainComponent]
})
export class AppModule { 
    constructor(utilService: UtilService){}
}
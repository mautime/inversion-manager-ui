import { OnInit, Component, ViewChild, AfterViewInit } from "@angular/core";
import { ExchangeTransactionManagerService } from "../../services/exchnage-transaction.service";
import { DataCatalogService } from "../../services/data-catalog.service";
import { BaseComponent } from "../base.component";
import { MatSnackBar, MatTabGroup, MatTab } from "@angular/material";
import { ErrorMessage } from "../../model/error-message.model";
import { SuccessMessage } from "../../model/success-message.model";
import { Router } from "@angular/router";
import { FormGroup } from "@angular/forms";
import { ExchangeTransactionFormComponent } from "../../components/exchange-transaction-form/exchange-transaction-form.component";
import { CryptoCoinService } from "../../services/crypto-coin.service";

@Component({
    selector: 'exchange-transaction', 
    templateUrl: '/exchange-transaction.component.html'
})
export class ExchangeTransactionComponent extends BaseComponent implements OnInit, AfterViewInit {
    private transactionType: string;

    transaction: any;
    exchangeSymbols: any[];
    exchangeTransactionTypes: any[];

    @ViewChild(ExchangeTransactionFormComponent)
    form: ExchangeTransactionFormComponent;

    @ViewChild(MatTabGroup)
    tabGroup: MatTabGroup;

    constructor(private router: Router, private exchangeTransactionService: ExchangeTransactionManagerService, 
        private dataCatalogService: DataCatalogService, private coinService: CryptoCoinService, 
        snackBar: MatSnackBar){
        super(snackBar);
    }

    ngOnInit(){
        console.log('ExchangeTransactionComponent#ngOnInit');

        this.transactionType = 'BUY';

        this._resetModel();

        this.coinService.getAll().subscribe(response => {
            console.log(response);
            this.exchangeSymbols = response;
        });

        this.exchangeTransactionTypes = this.dataCatalogService.getExchangeTransactionTypes();
        console.log(this.exchangeTransactionTypes);

        console.log(this.tabGroup);
        this.transaction.transactionType ==
        console.log(this.tabGroup.selectedIndex);
        console.log(this.transaction.transactionType);

        this.tabGroup.selectedTabChange.subscribe(tab => {
            this.transactionType = tab.index == 0 ? 'BUY' : 'SELL';
            this._resetModel();
        });
    }

    ngAfterViewInit(){
        console.log('ExchangeTransactionComponent#ngAfterViewInit');
        console.log(this.tabGroup);
    }

    saveTransaction(params){
        console.log('HomeComponent#saveTransaction');
        console.log(params);

        this.exchangeTransactionService.save(params.model, params.model.transactionType).subscribe(response => {
            console.log('exchangeTransactionService#saveTransaction - SUCCESS');
            console.log(response);
            this.showSuccessMessage(new SuccessMessage('Transaction saved'));
        }, error => {
            console.log('exchangeTransactionService#saveTransaction - ERROR');
            console.log(error);
            this.showErrorMessage(new ErrorMessage('Error'));
        });
    }

    saveAndNew(params){
        console.log('SAVE AND NEW');
        console.log(params);
        this._save(params, {
            success: e => {
                console.log('exchangeTransactionService#saveTransaction - SUCCESS');
                console.log(e);

                //this._resetModel();

                this._resetForm(params.form);
                this.showSuccessMessage(new SuccessMessage('Transaction saved'));
            }, error: e => {
                console.log('exchangeTransactionService#saveTransaction - ERROR');
                console.log(e);
                this.showErrorMessage(new ErrorMessage('Error'));
            }
        });
    }

    cancelTransaction(params){
        console.log('HomeComponent#cancelTransaction');
        console.log(params);
        this.router.navigateByUrl('/');
    }

    updateTargetAmount(params){
        console.log('HomeComponent#updateTargetAmount');
        console.log(params);

        this.exchangeTransactionService.calculateTargetAmount(params.model).subscribe(response => {
            console.log('exchangeTransactionService#calculateTargetAmount - SUCCESS');
            console.log(response);

            if (response.results != null){
                params.model.targetAmount = response.results;
            }
        });
    }

    updateSourceAmount(params){
        console.log('HomeComponent#updateSourceAmount');
        console.log(params);

        this.exchangeTransactionService.calculateSourceAmount(params.model).subscribe(response => {
            console.log('exchangeTransactionService#calculateSourceAmount - SUCCESS');
            console.log(response);

            if (response.results != null){
                params.model.sourceAmount = response.results;
            }
        });
    }

    private _save(params: any, callbacks: any){

        this.exchangeTransactionService.save(params.model, params.model.transactionType).subscribe(response => {
            callbacks.success(response);
        }, error => {
            callbacks.error(error);
        });
    }

    private _resetModel(){
        this.transaction = {
            transactionType: this.transactionType, 
            transactionDate: new Date()
        }
    }

    private _resetForm(form: FormGroup){
        form.reset();
        form.markAsUntouched();

        Object.keys(form.controls).forEach((name) => {

            let control = form.controls[name];
            control.setErrors(null);
        });
    }
}
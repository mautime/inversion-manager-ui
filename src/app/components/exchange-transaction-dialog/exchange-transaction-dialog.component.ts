import { OnInit, Inject, Component, EventEmitter } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA, MatSnackBar } from "@angular/material";
import { ExchangeTransactionManagerService } from "../../services/exchange-transaction.service";
import { BaseComponent } from "../../pages/base.component";
import { SuccessMessage } from "../../model/success-message.model";
import { ErrorMessage } from "../../model/error-message.model";
import { Router } from "@angular/router";
import { FormGroup } from "@angular/forms";

@Component({
    selector: 'exchange-transaction-dialog', 
    templateUrl: './exchange-transaction-dialog.html'
})
export class ExchangeTransactionDialogComponent extends BaseComponent implements OnInit {
    transaction: any;

    onSaveCompleted: EventEmitter<any> = new EventEmitter<any>();
    onSaveError: EventEmitter<any> = new EventEmitter<any>();
    onUpdateAmountsError: EventEmitter<any> = new EventEmitter<any>();

    constructor(private router: Router, private dialogRef: MatDialogRef<ExchangeTransactionDialogComponent>, private exchangeTransactionService: ExchangeTransactionManagerService, 
        @Inject(MAT_DIALOG_DATA) public data: any, snackBar: MatSnackBar){
            super(snackBar);
            this.transaction = data;
        }

    ngOnInit(){
        console.log('ExchangeTransactionDialogComponent#ngOnInit');
    }
    
    saveTransaction(params){
        console.log('HomeComponent#saveTransaction');
        console.log(params);

        this.exchangeTransactionService.save(params.model, params.model.transactionType).subscribe(response => {
            console.log('exchangeTransactionService#saveTransaction - SUCCESS');
            console.log(response);

            this.onSaveCompleted.emit({status: 'success', data: response});
        }, error => {
            console.log('exchangeTransactionService#saveTransaction - ERROR');
            console.log(error);
            this.onSaveError.emit({status: 'error', error: error});
        });
    }

    cancelTransaction(params){
        console.log('HomeComponent#cancelTransaction');
        console.log(params);
        //this.router.navigateByUrl('/');
        this.dialogRef.close();
    }

    updateTargetAmount(params){
        console.log('HomeComponent#updateTargetAmount');
        console.log(params);

        this.exchangeTransactionService.calculateTargetAmount(params.model).subscribe(response => {
            console.log('exchangeTransactionService#calculateTargetAmount - SUCCESS');
            console.log(response);

            if (response.results != null){
                this.transaction.targetAmount = response.results;
            }
        }, error => {
            this.onUpdateAmountsError.emit({status: 'error', error: error});
        });
    }

    updateSourceAmount(params){
        console.log('HomeComponent#updateSourceAmount');
        console.log(params);

        this.exchangeTransactionService.calculateSourceAmount(params.model).subscribe(response => {
            console.log('exchangeTransactionService#calculateSourceAmount - SUCCESS');
            console.log(response);

            if (response.results != null){
                this.transaction.sourceAmount = response.results;
            }
        }, error => {
            this.onUpdateAmountsError.emit({status: 'error', error: error});
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
            //transactionType: this.transactionType, 
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
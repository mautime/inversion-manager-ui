import { OnInit, Component, Input, EventEmitter, Output, ViewChild, ChangeDetectorRef } from "@angular/core";
import { MatSelect, MAT_DATE_FORMATS, MAT_NATIVE_DATE_FORMATS } from "@angular/material";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { ExchangeTransactionFormComponent } from "./exchange-transaction-form.component";
import { TypeaheadService } from "../../services/typeahead.service";

@Component({
    selector: 'exchange-transaction-sell-form', 
    templateUrl: './exchange-transaction-form.component.html'
})
export class ExchangeTransactionSellFormComponent extends ExchangeTransactionFormComponent implements OnInit {

    constructor(typeaheadService: TypeaheadService, cdRef: ChangeDetectorRef){
        super(typeaheadService, cdRef);
    }

    ngOnInit(){
        console.log('ExchangeTransactionSellFormComponent#ngOnInit');

        super.ngOnInit();

        this.transactionFormGroup.controls['sourceAmountInput'].disable({onlySelf: true});

        /*this.transactionFormGroup = new FormGroup({
            exchangeSymbolInput: new FormControl('', [
                Validators.required
            ]), 
            targetAmountInput: new FormControl('', [
                Validators.required, Validators.pattern('^(\\d*\\.)?\\d+$')
            ]), 
            exchangeRateInput: new FormControl('', [
                Validators.required
            ]), 
            transactionFeeInput: new FormControl('', [
                Validators.required
            ]), 
            sourceAmountInput: new FormControl({readonly: true}), 
            transactionDateInput: new FormControl('', [
                Validators.required
            ])
        });*/
    }
}
import { OnInit, Component, Input, EventEmitter, Output, ViewChild, ChangeDetectorRef } from "@angular/core";
import { MatSelect, MAT_DATE_FORMATS, MAT_NATIVE_DATE_FORMATS } from "@angular/material";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { ExchangeTransactionFormComponent } from "./exchange-transaction-form.component";
import { TypeaheadService } from "../../services/typeahead.service";

@Component({
    selector: 'exchange-transaction-buy-form', 
    templateUrl: './exchange-transaction-form.component.html'
})
export class ExchangeTransactionBuyFormComponent extends ExchangeTransactionFormComponent implements OnInit {

    constructor(typeaheadService: TypeaheadService, cdRef: ChangeDetectorRef){
        super(typeaheadService, cdRef);
    }

    ngOnInit(){
        console.log('ExchangeTransactionBuyFormComponent#ngOnInit');
        
        super.ngOnInit();

        this.transactionFormGroup.controls['targetAmountInput'].disable({onlySelf: true});
    }
}
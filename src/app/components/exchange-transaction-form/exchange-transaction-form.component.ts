import { OnInit, Component, Input, EventEmitter, Output, ViewChild } from "@angular/core";
import { MatSelect, MAT_DATE_FORMATS, MAT_NATIVE_DATE_FORMATS, MatAutocomplete, MatInput } from "@angular/material";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { TypeaheadService } from "../../services/typeahead.service";
import { Observable } from "rxjs/Observable";
import { switchMap } from "rxjs/operators";

@Component({
    selector: 'exchange-transaction-form', 
    templateUrl: './exchange-transaction-form.component.html'
})
export class ExchangeTransactionFormComponent implements OnInit {

    selectedExchangeSymbol: any = {};

    transactionFormGroup: FormGroup;

    @Input()
    exchangeSymbols: Observable<any[]>;

    @Input()
    transactionTypes: any[];

    @Input()
    model: any = {
        symbol: {}
    };

    @ViewChild('exchangeSymbolInputAutocompleteSelect')
    exchangeSymbolInputAutocompleteSelect: MatAutocomplete;

    @Output()
    onSave: EventEmitter<any> = new EventEmitter<any>();

    @Output()
    onSaveAndNew: EventEmitter<any> = new EventEmitter<any>();

    @Output()
    onCancel: EventEmitter<any> = new EventEmitter<any>();

    @Output()
    onUpdateAmount: EventEmitter<any> = new EventEmitter<any>(true);

    constructor(private typeaheadService: TypeaheadService){}

    ngOnInit(){
        console.log('ExchangeTransactionFormComponent#ngOnInit');

        this.transactionFormGroup = new FormGroup({
            exchangeSymbolInputAutocompleteInput: new FormControl(), 
            targetAmountInput: new FormControl('', [
                Validators.required, Validators.pattern('^(\\d*\\.)?\\d+$')
            ]), 
            exchangeRateInput: new FormControl('', [
                Validators.required
            ]), 
            transactionFeeInput: new FormControl('', [
                Validators.required
            ]), 
            sourceAmountInput: new FormControl('', [Validators.required, Validators.pattern('^(\\d*\\.)?\\d+$')]), 
            transactionDateInput: new FormControl('', [
                Validators.required
            ])
        });

        this.exchangeSymbolInputAutocompleteSelect.optionSelected.subscribe(e => {
            console.log(e);

            /*this.selectedExchangeSymbol = this.exchangeSymbols.pipe(map(array => {

            }));*/
            
            /*(function(symbol){
                return symbol.id == e.value;
            });*/

            console.log(this.selectedExchangeSymbol);
        });
        this.exchangeSymbols = this.transactionFormGroup.controls['exchangeSymbolInputAutocompleteInput'].valueChanges.pipe(switchMap(query => {
            console.log(query);

             return this.typeaheadService.getCoins(query);   
        }));
    }

    _save(){
        this.onSave.emit({model: this.model, form: this.transactionFormGroup});
    }

    _saveAndNew(){
        this.onSaveAndNew.emit({model: this.model, form: this.transactionFormGroup});
    }

    _cancel(){
        this.onCancel.emit({model: this.model, form: this.transactionFormGroup});
    }

    _onKeyUp(action: Function, event: KeyboardEvent){
        console.log('ExchangeTransactionFormComponent#_onKeyUp');
        console.log(event.keyCode);
        if ((event.keyCode >= 48 && event.keyCode <= 57) || (event.keyCode == 46 || event.keyCode == 8)){
            action(this.model);
        } else {
            event.preventDefault();
        }
    }

    _blur(event){
        console.log('ExchangeTransactionFormComponent#_blur');
        console.log(event);
        this.onUpdateAmount.emit({model: this.model});
    }

    _onUpdateExchangeRateAction = function(model){

    /*    if (model.transactionType == 'BUY'){
            model.targetAmount = undefined;
        } else if (model.transactionType == 'SELL'){
            model.sourceAmount = undefined;
        }*/
    };

    _onUpdateTransactionFeeAction = this._onUpdateExchangeRateAction;

    _onUpdateSourceAmountAction = function(model){
        model.targetAmount = undefined;
    }

    _onUpdateTargetAmountAction = function(model){
        console.log('_onUpdateTargetAmountAction');
        model.sourceAmount = undefined;
    }
}
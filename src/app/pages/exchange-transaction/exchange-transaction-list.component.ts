import { BaseComponent } from "../base.component";
import { OnInit, ViewChild, Component, EventEmitter } from "@angular/core";
import { MatSnackBar, MatTableDataSource, MatPaginator, MatSort, MatAutocomplete, MatChip, MatChipList, MatInput, MatChipInputEvent } from "@angular/material";
import { ExchangeTransactionManagerService } from "../../services/exchange-transaction.service";
import {merge} from 'rxjs/observable/merge';
import { Observable } from "rxjs/Observable";
import { CryptoCoinService } from "../../services/crypto-coin.service";
import { TypeaheadService } from "../../services/typeahead.service";
import { filter, take, map } from "rxjs/operators";
import {ENTER, COMMA} from '@angular/cdk/keycodes';
import { SuccessMessage } from "../../model/success-message.model";
import { ErrorMessage } from "../../model/error-message.model";
import { DataCatalogService } from "../../services/data-catalog.service";

@Component({
    selector: 'exchange-transaction-list', 
    templateUrl: './exchange-transaction-list.component.html'
})
export class ExchangeTransactionListComponent extends BaseComponent implements OnInit {

    searchCriteria: any;
    transactionTypes: Observable<any[]>;
    symbols: Observable<any[]>;
    
    exchangeTransactionsDataSource: MatTableDataSource<any>;

    searchEvent: EventEmitter<any> = new EventEmitter<any>();

    @ViewChild('searchSymbolAutocomplete')
    searchSymbolAutocomplete: MatAutocomplete;

    @ViewChild('exchangeTransactionsTablePaginator')
    exchangeTransactionsTablePaginator: MatPaginator;

    @ViewChild('exchangeTransactionsTableSort')
    exchangeTransactionsTableSort: MatSort;

    constructor(private exchangeTransactionService: ExchangeTransactionManagerService, private dataCatalogService: DataCatalogService, private typeaheadService: TypeaheadService, snackBar: MatSnackBar){
        super(snackBar);

        this.searchCriteria = {
            pagination: {
                max: 10, 
                offset: 0
            }, 
            transactionType: 0, 
            symbols: []
        };

        this.exchangeTransactionsDataSource = new MatTableDataSource<any>();
    }

    ngOnInit(){
        console.log('ExchangeTransactionListComponent#ngOnInit');
        
        this.transactionTypes = this.dataCatalogService.getExchangeTransactionTypes();
    }

    ngAfterViewInit() {
        this._refreshTable();

        merge(this.exchangeTransactionsTablePaginator.page, this.exchangeTransactionsTableSort.sortChange, this.searchEvent).subscribe(response => {
            console.log('merge');
            console.log(response);
            this._refreshTable();
        });

        this.searchSymbolAutocomplete.optionSelected.subscribe(item => {
            console.log('entra2');
            console.log(item);
            this.searchCriteria.symbols.push(item.option.value);
            this._resetPagination();
            this._refreshTable();
        });
    }

    search(){
        this.searchEvent.emit({searchCriteria: this.searchCriteria});
    }

    delete(id: number){
        this.exchangeTransactionService.delete(id).pipe(map(response => response.results)).subscribe(response => {
            if (response === 'success'){
                this.showSuccessMessage(new SuccessMessage(`Transaction ${id} has been deleted`));
            }

            this._refreshTable();
        }, error => {
            this.showErrorMessage(new ErrorMessage(`Unexpected exception while deleting transaction`));
        });
    }

    clearChipInput(event: MatChipInputEvent){

        if (event.input){
            event.input.value = '';
        }
    }

    removeChip(symbol: any): void {
        let index = this.searchCriteria.symbols.indexOf(symbol);
        if (index >= 0) {
            this.searchCriteria.symbols.splice(index, 1);

            this._resetPagination();
            this._refreshTable();
        }
    }

    onSearchSymbol($event){
        this.symbols = this.typeaheadService.getCoins($event);
    }

    private _refreshTable(){
        this.searchCriteria.pagination = {
            max: this.exchangeTransactionsTablePaginator.pageSize, 
            offset: (this.exchangeTransactionsTablePaginator.pageIndex) * this.exchangeTransactionsTablePaginator.pageSize, 
            sort: this.exchangeTransactionsTableSort.active, 
            dir: this.exchangeTransactionsTableSort.direction
        };

        this.exchangeTransactionService.search(this.searchCriteria).subscribe(response => {
            console.log('SUCCESS');
            console.log(response);
            this.exchangeTransactionsTablePaginator.length = response.results.total;
            this.exchangeTransactionsDataSource.data = response.results.results;

            //this.exchangeTransactionsTableDataSource._updatePaginator(30);
        });
    }

    private _resetPagination(){
        this.searchCriteria.pagination = {
            max: 10, 
            offset: 0
        }
    }
}
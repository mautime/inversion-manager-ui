import { BaseComponent } from "../base.component";
import { OnInit, ViewChild, Component, EventEmitter } from "@angular/core";
import { MatSnackBar, MatTableDataSource, MatPaginator } from "@angular/material";
import { ExchangeTransactionManagerService } from "../../services/exchange-transaction.service";
import {merge} from 'rxjs/observable/merge';

@Component({
    selector: 'exchange-transaction-list', 
    templateUrl: './exchange-transaction-list.component.html'
})
export class ExchangeTransactionListComponent extends BaseComponent implements OnInit {
    searchQuery: string;
    searchCriteria: any;
    exchangeTransactionsDataSource: MatTableDataSource<any>;

    searchEvent: EventEmitter<any> = new EventEmitter<any>();

    @ViewChild('exchangeTransactionsTablePaginator')
    exchangeTransactionsTablePaginator: MatPaginator;

    constructor(private exchangeTransactionService: ExchangeTransactionManagerService, snackBar: MatSnackBar){
        super(snackBar);

        this.searchCriteria = {
            pagination: {
                max: 10, 
                offset: 0
            }
        };

        this.exchangeTransactionsDataSource = new MatTableDataSource<any>();
    }

    ngOnInit(){
        console.log('ExchangeTransactionListComponent#ngOnInit');
    }

    ngAfterViewInit() {
        //this.exchangeTransactionsTableDataSource.paginator = this.exchangeTransactionsTablePaginator;

        this._refreshTable();

        merge(this.exchangeTransactionsTablePaginator.page, this.searchEvent).subscribe(response => {
            console.log('merge');
            console.log(response);
            this._refreshTable();
            //this.exchangeTransactionsTableDataSource.data = [];
        });
    }

    search(query: string){
        this.searchEvent.emit(query);
    }

    private _refreshTable(){
        this.searchCriteria.pagination = {
            max: this.exchangeTransactionsTablePaginator.pageSize, 
            offset: (this.exchangeTransactionsTablePaginator.pageIndex) * this.exchangeTransactionsTablePaginator.pageSize, 
            query: this.searchQuery
        };

        this.exchangeTransactionService.search(this.searchCriteria).subscribe(response => {
            console.log('SUCCESS');
            console.log(response);
            this.exchangeTransactionsTablePaginator.length = response.results.total;
            this.exchangeTransactionsDataSource.data = response.results.results;

            //this.exchangeTransactionsTableDataSource._updatePaginator(30);
        });
    }
}
import { OnInit, Component, ViewChild } from "@angular/core";
import { DataCatalogService } from "../../services/data-catalog.service";
import { ExchangeTransactionManagerService } from "../../services/exchnage-transaction.service";
import { MatTable, MatTableDataSource, MatPaginator } from "@angular/material";

import {merge} from 'rxjs/observable/merge';
import {interval} from 'rxjs/observable/interval';
import {timer} from 'rxjs/observable/timer';
import { Observable } from "rxjs/Observable";
import { switchMap, delay } from "rxjs/operators";

@Component({
    selector: 'home', 
    templateUrl: './home.component.html', 
    styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
    searchCriteria: any;
    inversionSummary: any;
    exchangeTransactionsTableDataSource: MatTableDataSource<any>;

    @ViewChild(MatPaginator)
    exchangeTransactionsTablePaginator: MatPaginator;

    constructor(private dataCatalogService: DataCatalogService, private exchangeTransactionService: ExchangeTransactionManagerService){
        this.exchangeTransactionsTableDataSource = new MatTableDataSource<any>();
    }

    ngOnInit(){
        console.log('HomeComponent#ngOnInit');

        this.searchCriteria = {
            pagination: {
                max: 10, 
                offset: 0
            }
        };

        timer(0, 60 * 1000 * 60).pipe(switchMap(() => this.exchangeTransactionService.getInversionSummary())).subscribe(response => {
            this.inversionSummary = response.results;
        });
    }

    ngAfterViewInit() {
        //this.exchangeTransactionsTableDataSource.paginator = this.exchangeTransactionsTablePaginator;

        this._refreshTable();

        merge(this.exchangeTransactionsTablePaginator.page).subscribe(response => {
            console.log('merge');
            console.log(response);
            this._refreshTable();
            //this.exchangeTransactionsTableDataSource.data = [];
        });
    }

    private _refreshTable(){
        this.searchCriteria.pagination = {
            max: this.exchangeTransactionsTablePaginator.pageSize, 
            offset: (this.exchangeTransactionsTablePaginator.pageIndex) * this.exchangeTransactionsTablePaginator.pageSize
        };

        this.exchangeTransactionService.search(this.searchCriteria).subscribe(response => {
            console.log('SUCCESS');
            console.log(response);
            this.exchangeTransactionsTablePaginator.length = response.results.total;
            this.exchangeTransactionsTableDataSource.data = response.results.results;

            //this.exchangeTransactionsTableDataSource._updatePaginator(30);
        });
    }
}
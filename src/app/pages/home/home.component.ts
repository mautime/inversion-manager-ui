import { OnInit, Component, ViewChild } from "@angular/core";
import { DataCatalogService } from "../../services/data-catalog.service";
import { ExchangeTransactionManagerService } from "../../services/exchange-transaction.service";
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
    inversionSummary: any;

    @ViewChild(MatPaginator)
    exchangeTransactionsTablePaginator: MatPaginator;

    constructor(private dataCatalogService: DataCatalogService, private exchangeTransactionService: ExchangeTransactionManagerService){
    }

    ngOnInit(){
        console.log('HomeComponent#ngOnInit');

        timer(0, 60 * 1000 * 60).pipe(switchMap(() => this.exchangeTransactionService.getInversionSummary())).subscribe(response => {
            console.log('ENTRA');
            console.log(response);

            /*(<any[]>response.summary).sort((x: any, y: any) => {
                let result: number = 0;
                console.log('SORT');
                console.log(x.symbolLogo);
                console.log(x.exchangeSymbol);
                console.log(y.order);
                if (x.order > y.order) {
                    result = 1;
                } else if (x.order < y.order){
                    result = -1;
                }

                console.log(result);
                return result;
            }).forEach(function(element, index){
                console.log(element.order);
            });*/

            this.inversionSummary = response;
        });
    }

    ngAfterViewInit() {
        //this.exchangeTransactionsTableDataSource.paginator = this.exchangeTransactionsTablePaginator;
    }
}
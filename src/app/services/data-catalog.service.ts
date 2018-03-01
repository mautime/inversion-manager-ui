import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs/Observable";
import { Injectable } from "@angular/core";

@Injectable()
export class DataCatalogService {
    constructor(private http: HttpClient){}

    getExchangeSymbols(): Observable<any> {
        return this.http.get('http://localhost:8080/api/data/exchange/symbols');
    }

    getExchangeTransactionTypes(): any[] {
        return [{
            id: 'BUY', name: 'BUY'
        }, {
            id: 'SELL', name: 'SELL'
        }];
    }
}
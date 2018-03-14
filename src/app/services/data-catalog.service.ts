import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs/Observable";
import { Injectable } from "@angular/core";

@Injectable()
export class DataCatalogService {
    constructor(private http: HttpClient){}

    getExchangeSymbols(): Observable<any> {
        return this.http.get('/api/data/exchange/symbols');
    }

    getExchangeTransactionTypes(): Observable<any[]> {
        return Observable.create(subscriber => {
            subscriber.next([{
                id: 'BUY', name: 'BUY'
            }, {
                id: 'SELL', name: 'SELL'
            }]);
            subscriber.complete();
        });
    }
}
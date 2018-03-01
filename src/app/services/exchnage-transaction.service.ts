import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs/Observable";
import { map } from "rxjs/operators";
import { Injectable } from "@angular/core";
import { CryptoCoinService } from "./crypto-coin.service";

@Injectable()
export class ExchangeTransactionManagerService {
    constructor(private http: HttpClient, private cryptoCoinService: CryptoCoinService){}

    get(id: number): Observable<any>{
        return this.http.get(`http://localhost:8080/api/inversion/exchange/transactions/${id}`);
    }

    search(searchCriteria): Observable<any>{
        let instance = this;
        let params = new HttpParams();

        params = params.append('max', searchCriteria.pagination.max)
            .append('offset', searchCriteria.pagination.offset);
        
        return this.http.get<any>('http://localhost:8080/api/inversion/exchange/transactions', {params: params}).pipe(map(e => {
            console.log('EEEEEEEEE');
            console.log(e);
            e.results.results.forEach(function(element, index){

                instance.cryptoCoinService.getCoinInfo(element.symbol).subscribe(info => {
                    element.symbolLogo = info.logo;
                });
            });

            return e;
        }));
    }

    save(transaction: any, transactionType: string): Observable<any> {
        return this.http.post('http://localhost:8080/api/inversion/exchange/transactions', transaction, {params: new HttpParams().set('type', transactionType)});
    }

    calculateSourceAmount(transaction: any): Observable<any> {
        transaction.sourceAmount = null;
        return this._calculateAmount(transaction, 'SOURCE_AMOUNT');
    }

    calculateTargetAmount(transaction: any): Observable<any> {
        transaction.targetAmount = null;
        return this._calculateAmount(transaction, 'TARGET_AMOUNT');
    }

    getInversionSummary(): Observable<any> {
        return this.http.get<any>('http://localhost:8080/api/inversion/exchange/summary').pipe(map(response => {
            console.log('PIPE');
            console.log(response);

            if (response.results && response.results.summary){
                let instance = this;
                response.results.gain = 0;
                
                response.results.summary.forEach(function(element, index){
                    instance.cryptoCoinService.getCoinInfo(element.exchangeSymbol).subscribe(info => {
                        element.symbolLogo = info.logo;
                    });

                    instance.cryptoCoinService.getCoinPrice(element.exchangeSymbol).subscribe(price => {
                        element.marketValue = price['USD'];
                        element.worth = element.marketValue * element.totalTargetAmount;
                        element.gain = (element.worth) - element.totalSourceAmount;

                        response.results.gain += element.gain;
                    });
                });
            }

            return response;
        }));
    }

    private _calculateAmount(transaction: any, calculationType: string): Observable<any> {
        let params = new HttpParams();
        let result = Observable.create(subscriber => {
            subscriber.complete();
        });
        
        if (transaction && (transaction.exchangeRate && transaction.transactionFee && transaction.transactionType)){
            params = params.append('exchangeRate', transaction.exchangeRate || null)
            .append('transactionFee', transaction.transactionFee || null)
            .append('transactionType', transaction.transactionType);

            if (calculationType == 'TARGET_AMOUNT'){
                params = params.append('sourceAmount', transaction.sourceAmount);
                result = this.http.get('http://localhost:8080/api/inversion/exchange/transactions/helper/calculateTargetAmount', {params: params});
            } else if (calculationType == 'SOURCE_AMOUNT'){
                params = params.append('targetAmount', transaction.targetAmount);
                result = this.http.get('http://localhost:8080/api/inversion/exchange/transactions/helper/calculateSourceAmount', {params: params});
            }
        }
        
        return result;
    }
}
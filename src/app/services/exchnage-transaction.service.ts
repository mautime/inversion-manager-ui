import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs/Observable";
import { forkJoin } from 'rxjs/observable/forkJoin';
import { map, tap, switchMap, mergeMap, filter, finalize, take } from "rxjs/operators";
import { Injectable } from "@angular/core";
import { CryptoCoinService } from "./crypto-coin.service";
import { BehaviorSubject } from "rxjs/BehaviorSubject";

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
        return this.http.get<any>('http://localhost:8080/api/inversion/exchange/summary').pipe(
        map(response => response.results),
        filter(response => response.summary != null && response.total != null), 
        switchMap((response: any) => {
            console.log('PIPE');
            console.log(response);

            let instance = this;

            response.gain = 0;
            response.worth = 0;
            let count = 0;
            let subject: BehaviorSubject<number> = new BehaviorSubject(0);

            response.summary.map(item => {

                forkJoin(instance.cryptoCoinService.getCoinInfo(item.exchangeSymbol), instance.cryptoCoinService.getCoinPrice(item.exchangeSymbol)).subscribe(data => {
                    console.log('SUPER SUBSCRIBE');
                    console.log(data[0]);
                    item.symbolLogo = data[0].logo;
                    item.order = data[0].order;

                    item.marketValue = data[1]['USD'];
                    item.worth = item.marketValue * item.totalTargetAmount;
                    item.gain = (item.worth) - item.totalSourceAmount;

                    response.worth += item.worth;
                    response.gain += item.gain;
                    count++;

                    subject.next(count);
                });
            });

            return subject.pipe(filter(count => count == response.summary.length), map(res => {
                response.summary.sort((x: any, y: any) => {
                    if (x.order > y.order) {
                        return 1;
                    } else if (x.order < y.order){
                        return -1
                    } else {
                        return 0;
                    }
                });

                return response;
            }));
            //return response;
            /*if (response.results && response.results.summary){
                let instance = this;
                response.results.gain = 0;
                
                response.results.summary.forEach(function(element, index){
                    instance.cryptoCoinService.getCoinInfo(element.exchangeSymbol).subscribe(info => {
                        element.symbolLogo = info.logo;
                        element.order = info.order;
                    });

                    instance.cryptoCoinService.getCoinPrice(element.exchangeSymbol).subscribe(price => {
                        element.marketValue = price['USD'];
                        element.worth = element.marketValue * element.totalTargetAmount;
                        element.gain = (element.worth) - element.totalSourceAmount;

                        response.results.gain += element.gain;
                    });
                });
            }

            return response.results;*/
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
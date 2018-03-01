import { Observable } from "rxjs/Observable";
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { map, filter, switchMap, take } from "rxjs/operators";
import { BehaviorSubject } from "rxjs/BehaviorSubject";

@Injectable()
export class CryptoCoinService {
    constructor(private http: HttpClient){}

    private coinInfoCache: any = null;
    private coinInfoListCache: any[] = null;
    private coinInfoListCacheSubject: BehaviorSubject<any[]> = new BehaviorSubject(null);

    getAll(): Observable<any>{
        let instance = this;
        let response = null;

        if (this.coinInfoCache != null){
            response = Observable.create(subscriber => {
                subscriber.next(this.coinInfoCache);
                subscriber.complete();
            });
        } else {
            let parsedResponse: any = {};

            response = this.http.get<any>('/api/data/coinlist/').pipe(map(response => {
                if (response.Data){

                    Object.keys(response.Data).forEach(function(element, index){
                        response.Data[element].ImageUrl = response.BaseImageUrl + response.Data[element].ImageUrl;

                        parsedResponse[element] = instance._convertCoinInfo(response.Data[element]);
                    });
                }

                this.coinInfoCache = parsedResponse;
                
                return parsedResponse;
            }));
        }

        return response;
    }

    list(): Observable<any[]> {
        let instance = this;
        let response = null;

        if (this.coinInfoListCache != null){
            //console.log(this.coinInfoListCache);
            /*response = this.coinInfoListCacheSubject.pipe(filter(array => array.length > 50), take(1), switchMap(array => {
                return array;
            }));**/

            return Observable.create(subscriber => {
                subscriber.next(this.coinInfoListCache);
                subscriber.complete();
            });
        } else {
            this.coinInfoListCache = [];
            response = this.getAll().pipe(map(coinInfoMap => {
                let results:any[] = [];
    
                Object.keys(coinInfoMap).forEach(function(symbol, index){
                    results.push(coinInfoMap[symbol]);
                });

                
                //this.coinInfoListCache = results;
                //this.coinInfoListCacheSubject.next(this.coinInfoListCache);
                instance.coinInfoListCache = results.sort((x: any, y: any) => {
                    if (x.order > y.order) {
                        return 1;
                    } else if (x.order < y.order){
                        return -1
                    } else {
                        return 0;
                    }
                })

                return instance.coinInfoListCache;
            }));
        }

        return response;
    }

    getCoinInfo(coinSymbol: string): Observable<any>{
        return this.getAll().pipe(
            map(e => {
                return e[coinSymbol];
            })
        );
    }

    getCoinPrice(coinSymbol: string): Observable<any> {
        return this.http.get(`https://min-api.cryptocompare.com/data/price?fsym=${coinSymbol}&tsyms=USD`);
    }

    private _convertCoinInfo(response: any): any{
        return {
            symbol: response.Symbol,  
            name: response.CoinName, 
            description: response.FullName, 
            logo: response.ImageUrl, 
            order: +response.SortOrder
        }
    }
}
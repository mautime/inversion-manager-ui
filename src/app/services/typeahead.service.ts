import { Observable } from "rxjs/Observable";
import { Injectable } from "@angular/core";
import { CryptoCoinService } from "./crypto-coin.service";
import { switchMap, filter, take, map } from "rxjs/operators";

@Injectable()
export class TypeaheadService {
    
    constructor(private coinService: CryptoCoinService){}

    getCoins(query: string): Observable<any[]> {
        return this.coinService.list().pipe(map(array => {
            return array.filter(coinInfo => query && coinInfo.description.toLowerCase().indexOf(query.toLowerCase()) != -1).slice(0, 10);
        }));
    }
}
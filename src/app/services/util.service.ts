import { Injector, Injectable } from "@angular/core";
import { DatePipe } from "@angular/common";
import { ActivatedRouteSnapshot } from "@angular/router";
import { BehaviorSubject } from "rxjs/BehaviorSubject";
import { Observable } from "rxjs/Observable";

@Injectable()
export class UtilService {
    public static DEFAULT_DATE_FORMAT: string = 'MM-dd-yyyy';

    static injector: Injector;

    private datePipe: DatePipe;

    private titleTokens: BehaviorSubject<any[]> = new BehaviorSubject<any[]>(null);

    constructor(injector: Injector){
        console.log('UtilService+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++');
        UtilService.injector = injector;
        this.datePipe = new DatePipe('en-US');;
    }

    public format(date: Date, format: string = UtilService.DEFAULT_DATE_FORMAT): string {
        return this.datePipe.transform(date, format);
    }

    public buildTitle(route: ActivatedRouteSnapshot) {
        let tokens = [];

        console.log('UtilService#buildTitle');

        this._buildTitle(route, tokens);

        this.titleTokens.next(tokens);

        console.log(tokens);
    }

    public getTitle(): Observable<any[]> {
        return this.titleTokens.asObservable();
    }

    private _buildTitle(route: ActivatedRouteSnapshot, tokens: any[]): void {
        console.log(route);
        if (route.parent){
            this._buildTitle(route.parent, tokens);
        }

        tokens.push(route.data.title);
    }
}
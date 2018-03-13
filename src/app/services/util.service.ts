import { Injector, Injectable } from "@angular/core";
import { DatePipe } from "@angular/common";

@Injectable()
export class UtilService {
    public static DEFAULT_DATE_FORMAT: string = 'MM-dd-yyyy';

    static injector: Injector;

    private datePipe: DatePipe;

    constructor(injector: Injector){
        console.log('UtilService+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++');
        UtilService.injector = injector;
        this.datePipe = new DatePipe('en-US');;
    }

    public format(date: Date, format: string = UtilService.DEFAULT_DATE_FORMAT): string{
        return this.datePipe.transform(date, format);
    }
}
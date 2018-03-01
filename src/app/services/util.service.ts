import { Injector, Injectable } from "@angular/core";

@Injectable()
export class UtilService {
    static injector: Injector;

    constructor(injector: Injector){
        console.log('UtilService+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++');
        UtilService.injector = injector;
    }
}
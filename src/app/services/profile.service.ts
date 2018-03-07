import { Observable } from "rxjs/Observable";
import { HttpClient } from "@angular/common/http";
import { map } from "rxjs/operators";
import { Injectable } from "@angular/core";

@Injectable()
export class ProfileService {
    constructor(private http: HttpClient){}

    register(user: any): Observable<any> {
        return this.http.post('http://localhost:8080/api/profile', user).pipe(map((response: any) => response.results));
    }

    exists(email: string): Observable<any> {
        return this.http.get(`http://localhost:8080/api/profile/check/${email}`).pipe(map((response: any) => response.results));
    }
}
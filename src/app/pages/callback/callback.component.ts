import { Component, OnInit } from '@angular/core';
import { AuthorizationService } from '../../services/auth.service';
import { ProfileService } from '../../services/profile.service';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { filter, take } from 'rxjs/operators';

@Component({
  selector: 'app-callback',
  templateUrl: './callback.component.html',
  styleUrls: ['./callback.component.css']
})
export class CallbackComponent implements OnInit {

    constructor() { }
    
    ngOnInit() {
        console.log('CallbackComponent#ngOnInit');
    }

}
import { OnInit, Component, EventEmitter, Output, Input, AfterViewInit } from "@angular/core";
import { FormGroup, FormControl, Validators, ValidatorFn, AbstractControl, AsyncValidatorFn, ValidationErrors } from "@angular/forms";
import { Observable } from "rxjs/Observable";
import { map, switchMap } from "rxjs/operators";

@Component({
    selector: 'profile-form', 
    templateUrl: './profile-form.component.html'
})
export class ProfileFormComponent implements OnInit, AfterViewInit {

    private profileFormGroup: FormGroup;

    @Input()
    model: any;

    @Input()
    onCheckExistingObservable: (email: string) => Observable<boolean>;

    @Output()
    onSave: EventEmitter<any> = new EventEmitter<any>();

    @Output()
    onCancel: EventEmitter<any> = new EventEmitter<any>();

    constructor(){}

    ngOnInit(){
        console.log('ProfileForm#ngOnInit');

        this.profileFormGroup = new FormGroup({
            email: new FormControl(this.model.email, [
                Validators.required, Validators.email
            ], [this.existEmailValidator()]), 
            firstName: new FormControl(this.model.firstName, [
                Validators.required, Validators.maxLength(50)
            ]), 
            lastName: new FormControl(this.model.lastName, [
                Validators.required, Validators.maxLength(50)
            ]), 
            password: new FormControl(this.model.password, [
                Validators.required, Validators.maxLength(50)
            ]), 
            passwordConfirmation: new FormControl(this.model.passwordConfirmation, [
                Validators.required
            ])
        }, this.equalValueValidator('password', 'passwordConfirmation'));

        if (this.model.email){
            this.profileFormGroup.get('passwordConfirmationInput').disable({onlySelf: true, emitEvent: false});
        }

        this.profileFormGroup.valueChanges.subscribe(object => {
            this.model = object;
        });
    }

    ngAfterViewInit(){
        console.log('ProfileForm#ngAfterViewInit');
    }

    _save() {
        console.log('SAVE');
        this.onSave.emit({model: this.model, form: this.profileFormGroup});
    }

    _cancel() {
        this.onCancel.emit({model: this.model, form: this.profileFormGroup});
    }

    _checkExisting(event) {
        console.log(event);
        console.log(this.model.email);
        //this.onCheckExisting.emit({model: this.model, form: this.profileFormGroup});
    }

    /** this control value must be equal to given control's value */
    equalValueValidator(targetKey: string, toMatchKey: string): ValidatorFn {
        return (group: FormGroup): {[key: string]: any} => {
            const target = group.controls[targetKey];
            const toMatch = group.controls[toMatchKey];
            let result = {equalValue: targetKey + ' != ' + toMatchKey};

            if (target.value || toMatch.value){

                if (toMatch.value){
                    result = target.value === toMatch.value ? null : result;
                }
            } else {
                result = null;
            }
            
            toMatch.markAsTouched({onlySelf: true});
            toMatch.setErrors(result ? {equalValue: targetKey} : null);
            return result;
            /*if (true) {
                const isMatch = target.value === toMatch.value;
                // set equal value error on dirty controls
                if (!isMatch && target.valid && toMatch.valid) {
                toMatch.setErrors({equalValue: targetKey});
                const message = targetKey + ' != ' + toMatchKey;
                return {'equalValue': message};
                }
                if (isMatch && toMatch.hasError('equalValue')) {
                //toMatch.setErrors(null);
                }
            }
        
            return null;
            */
        };
    }

    existEmailValidator(): AsyncValidatorFn {

        return (control: AbstractControl): Observable<ValidationErrors> => {
            console.log('existEmailValidator');
            console.log(control.value);

            return this.onCheckExistingObservable(control.value).pipe(switchMap(exists => {
                console.log('Inside onCheckExistingObservable');
                console.log(exists);
                //let result = Obserbable.create();
                return exists ? Observable.create(subs => {subs.next({exists: control.value}); subs.complete()}) : Observable.create(subs => {subs.next(null); subs.complete()});
            }));
        }
    }
}
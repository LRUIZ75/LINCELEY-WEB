import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MtxFormGroupModule } from '@ng-matero/extensions';
import { PeopleService } from 'app/services/people.service';
import { UsersService } from 'app/services/users.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'users-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.scss'],
  providers: [PeopleService, UsersService],
})
export class AddComponent implements OnInit {
  isLinear = true;
  personFormGroup: FormGroup;
  accountFormGroup: FormGroup;
  rolesFormGroup: FormGroup;

  @Output() changeStateEvent = new EventEmitter<string>();

  constructor(
    private formBuilder: FormBuilder,
    private toaster: ToastrService,
    private userService: UsersService,
    private peopleService: PeopleService
  ) {}

  ngOnInit(): void {
    this.personFormGroup = this.formBuilder.group({
      names: ['', Validators.required],
      lastNames: ['', Validators.required],
      personalId: ['', Validators.required],
      picture: [''],
      mobileNumber: ['', Validators.required],
    });
    this.accountFormGroup = this.formBuilder.group({
      name: ['', Validators.required],
      email: ['', Validators.required, Validators.email],
      password: ['', Validators.required],
    });

    this.rolesFormGroup = this.formBuilder.group({
      roles: ['', Validators.required],
    });
  }

  changeState(value: string) {
    this.changeStateEvent.emit(value);
  }

  onSubmit() {
    //Validate all 3 forms
    if (!this.personFormGroup.valid) this.toaster.warning('Person Data is not valid', 'Cancelled');
    if (!this.accountFormGroup.valid)
      this.toaster.warning('Account Data is not valid', 'Cancelled');
    if (!this.rolesFormGroup.valid)
      this.toaster.warning('Permissions Data is not valid', 'Cancelled');

    var result: any;
    result = this.peopleService.addData(this.personFormGroup.value).toPromise();
    var person: any = JSON.parse(JSON.stringify(result));
    
    if (person?.status != 'ok') {
      this.toaster.warning('Cannot write new person record', 'Cancelled');
    }

    //if everything ok,

    //save person
    //save accout with roles
    //Toaster Notification
    //change the state back to RETRIEVE mode
  }
}

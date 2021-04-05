import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AsyncValidatorFn, ValidationErrors, AsyncValidator } from '@angular/forms';
import { MtxFormGroupModule } from '@ng-matero/extensions';
import { PeopleService, Person } from 'app/services/people.service';
import { User, UsersService } from 'app/services/users.service';
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

  public newPerson: any;
  public newUser: any;

  @Output() changeStateEvent = new EventEmitter<string>();

  constructor(
    private formBuilder: FormBuilder,
    private toaster: ToastrService,
    private userService: UsersService,
    private peopleService: PeopleService
  ) {}

  ngOnInit(): void {
    this.personFormGroup = this.formBuilder.group({
      names: ['', [Validators.required, Validators.minLength(2)]],
      lastNames: ['', [Validators.required, Validators.minLength(2)]],
      personalId: ['', [Validators.required]],
      picture: [''],
      mobileNumber: ['', [Validators.required]],
    });

    this.accountFormGroup = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(20), Validators.pattern(/^([A-Z]|[a-z])[A-Za-z0-9]+$/)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });

    this.rolesFormGroup = this.formBuilder.group({
      roles: [[], [Validators.required]],
    });
  }

  changeState(value: string) {
    this.changeStateEvent.emit(value);
  }

  async onSubmit() {
    //Validate all 3 forms
    this.personFormGroup.errors


    if (!this.personFormGroup.valid) {
      this.toaster.warning('Person data is not valid', 'Cancelled');
      return;
    }

    if (!this.accountFormGroup.valid) {
      this.toaster.warning('Account data is not valid', 'Cancelled');
      return;
    }

    if (!this.rolesFormGroup.valid) {
      this.toaster.warning('Account data is not valid', 'Cancelled');
      return;
    }

    var data: any;

    data = <Person>this.personFormGroup.value;

    await this.peopleService
      .addData(data)
      .toPromise()
      .then(resp => {
        this.newPerson = <Person>resp.created;
        if (!this.newPerson) {
          this.toaster.error('Error agregando datos de persona');
          return;
        }
      }).catch(err=>{
        this.toaster.error(err);
        return;
      });

    data = <User>this.accountFormGroup.value;
    data.person = this.newPerson._id;
    data.salt = '';
    data.emailVerified = false;
    data.isActive = true;

    await this.userService
      .addData(data)
      .toPromise()
      .then(resp => {
        this.newUser = <User>resp.created;

        if (!this.newUser) {
          this.toaster.error('Error agregando datos de cuenta');
          return;
        }
        this.toaster.info('Usuario creado! Debe verificar su correo!');
        //change the state back to RETRIEVE mode
        
      })
      .catch(err => {
        this.toaster.error(err);
        return;
      });
      this.changeState('RETRIEVE');
  }
}

import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  AsyncValidatorFn,
  ValidationErrors,
  AsyncValidator,
} from '@angular/forms';
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

  // Archivos de imagenes
  files: File[] = [];
  picture: any;
  public newPerson: any;
  public newUser: any;
  public hide = true;

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
      picture: [{ value: '', disabled: true }, [Validators.required]],
      mobileNumber: ['', [Validators.required]],
    });

    this.accountFormGroup = this.formBuilder.group({
      name: [
        '',
        [
          Validators.required,
          Validators.minLength(4),
          Validators.maxLength(20),
          Validators.pattern(/^([A-Z]|[a-z])[A-Za-z0-9]+$/),
        ],
      ],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });

    this.rolesFormGroup = this.formBuilder.group({
      roles: [[], [Validators.required]],
    });
  }

  onSelect(event) {
    console.log(event);
    if (this.files.length > 0) {
      this.files = [];
    }
    this.files.push(...event.addedFiles);
    this.personFormGroup.get('picture').setValue(this.files[0].name);
  }

  onRemove(event) {
    console.log(event);
    this.files.splice(this.files.indexOf(event), 1);
    if (!this.files.length) this.personFormGroup.get('picture').setValue('');
  }

  changeState(value: string) {
    this.changeStateEvent.emit(value);
  }

  /**
   * Leer el archivo desde webkitRelativePath
   * @param file   this.readFile(this.files[0]).then(fileContents => { // Put this string in a request body to upload it to an API.}
   * @returns Null o la URL al archivo
   */
  private async readFile(file: File): Promise<string | ArrayBuffer> {
    return new Promise<string | ArrayBuffer>((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = e => {
        return resolve((e.target as FileReader).result);
      };

      reader.onerror = e => {
        console.error(`FileReader failed on file ${file.name}.`);
        return reject(null);
      };

      if (!file) {
        console.error('No file to read.');
        return reject(null);
      }

      reader.readAsDataURL(file);
    });
  }

  async onSubmit() {
    //Validate all 3 forms
    this.personFormGroup.errors;

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
      })
      .catch(err => {
        this.toaster.error(err);
        return;
      });


    // Set paramaters for updatePicture and
    if (this.files.length) {
      await this.readFile(this.files[0])
        .then(pictureFile => {
          this.picture = pictureFile;
        })
        .catch(err => {
          this.toaster.error(err);
          return;
        });
    }

    


    await this.peopleService
      .updatePicture(this.newPerson._id, this.files[0])
      .toPromise()
      .then(resp => {
        this.newPerson = <Person>resp.updated;
        if (!this.newPerson) {
          this.toaster.error('Error subiendo imagen de persona');
          return;
        }
      })
      .catch(err => {
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
        this.toaster.info('Usuario creado -> Debe verificar su correo!');
        //change the state back to RETRIEVE mode
      })
      .catch(err => {
        this.toaster.error(err);
        return;
      });
    this.changeState('RETRIEVE');
  }
}

import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CompaniesService, Person, PeopleService } from 'app/services';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-addpeople',
  templateUrl: './addpeople.component.html',
  styleUrls: ['./addpeople.component.scss'],
})
export class AddpeopleComponent implements OnInit {
  /**
   * Formulario de Agregar/Editar
   */
  personFormGroup: FormGroup;
  public person: Person;
  public newPerson: any = {};

  files: File[] = [];
  picture: any;

  birthday: Date;
  maxBirthday = new Date();

  @Output() changeStateEvent = new EventEmitter<string>();

  @Input() formMode = 'ADD';
  @Input() initialData: any = {};

  constructor(
    private formBuilder: FormBuilder,
    private peopleService: PeopleService,
    private companyService: CompaniesService,
    private toaster: ToastrService
  ) {}

  ngOnInit(): void {
    this.personFormGroup = this.formBuilder.group({
      names: ['', [Validators.required, Validators.minLength(2)]],
      lastNames: ['', [Validators.required, Validators.minLength(2)]],
      citizenId: ['', [Validators.required]],
      picture: [''],
      phone: [''],
      mobile: ['', [Validators.required]],
      birthdate: [''],
      homeAddress: [''],
      isUser: [false],
      isEmployee: [false],
      isClient: [false],
    });

    if (this.formMode == 'EDIT' && this.initialData) {
      this.personFormGroup.patchValue(this.initialData as Person);
      this.birthday = this.initialData.birthdate;
    }

    this.personFormGroup.get("picture").disable();
    
  }

  /*   get fullName() {
    return this.personFormGroup.get('fullName');
  }

  get shortName() {
    return this.personFormGroup.get('shortName');
  } */

  /**
   * Resetea el valor de todos los campos
   */
  onReset() {
    this.personFormGroup.reset();
  }

  /**
   * Cancela el modo de agregar/editar
   */
  onCancel() {
    this.changeState('RETRIEVE');
  }

  /**
   * Cambia el estado actual de acceso a datos
   * @param value Nuevo Estado
   */
  changeState(value: string) {
    this.changeStateEvent.emit(value);
  }

  onSubmit() {
    if (!this.personFormGroup.valid) {
      this.toaster.warning('El formulario tiene errores!');
      return;
    }

    this.person = <Person> this.personFormGroup.value;

    switch (this.formMode) {
      case 'EDIT':
        this.peopleService
          .updateData(this.initialData._id, this.person)
          .toPromise()
          .then(resp => {
            if (!resp) {
              this.toaster.error('Operación fallida!');
              return;
            }

            this.newPerson = <Person> resp.updated;
            if (this.files.length > 0) //solicita nueva imagen en modo editar
            this.updatePicture(this.newPerson._id);
            this.toaster.success('Operación exitosa!');
            this.changeState('RETRIEVE');
          })
          .catch(err => {
            this.toaster.error(err);
          });
        break;

      case 'ADD':
        this.peopleService
          .addData(this.person)
          .toPromise()
          .then(resp => {
            if (!resp) {
              this.toaster.error('Operación fallida!');
              return;
            }

            this.newPerson = <Person> resp.created;
            if(this.files.length > 0) //agregó una foto
            this.updatePicture(this.newPerson._id);
            this.toaster.success('Operación exitosa!');
            this.changeState('RETRIEVE');
          })
          .catch(err => {
            this.toaster.error(err);
          });

        break;

      default:
        this.toaster.warning('Se desconoce el modo del formulario');
    }


  }

  updatePicture(id: string) {
    //update picture data

    this.peopleService
      .updatePicture(id, this.files[0])
      .toPromise()
      .then(resp => {
        if (!resp) {
          this.toaster.error('Operación fallida!');
          return;
        }
      })
      .catch(err => {
        this.toaster.error(err);
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
}

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
  person: Person;

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
      isClient: [false ],
    });

    if (this.formMode == 'EDIT' && this.initialData) {
      this.personFormGroup.patchValue(this.initialData as Person);
      this.birthday = this.initialData.birthdate;
    }
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

    this.person = <Person>this.personFormGroup.value;

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

            this.person = <Person>resp.updated;
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

            this.person = <Person>resp.created;
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
}

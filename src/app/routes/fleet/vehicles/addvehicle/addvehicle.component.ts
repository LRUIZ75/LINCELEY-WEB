import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
//import { MatCheckboxChange } from '@angular/material/checkbox';
import {
  Vehicle,
  VehiclesService,
  Company,
  CompaniesService,
  Person,
  PeopleService,
} from 'app/services';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-addvehicle',
  templateUrl: './addvehicle.component.html',
  styleUrls: ['./addvehicle.component.scss'],
})
export class AddvehicleComponent implements OnInit {
  /**
   * Formulario de Agregar/Editar
   */
  vehicleFormGroup: FormGroup;
  vehicle: Vehicle;

  public typeList: any[]= [{"id":"AUTO","type":"AUTO"}, {"id":"MOTO","type":"MOTO"}, {"id":"PICKUP","type":"PICKUP"}, {"id":"TRUCK","type":"TRUCK"}];
  public companyList: any[] = [];
  public companies: any[] = [];
  public personList: any[] = [];
  public people: any[] = [];
  public filesRegistrationCard: File[] = [];
  public filesInsuranceCard: File[] = [];

  @Output() changeStateEvent = new EventEmitter<string>();

  @Input() formMode = 'ADD';
  @Input() initialData: any = {};

  constructor(
    private formBuilder: FormBuilder,
    private companyService: CompaniesService,
    private personService: PeopleService,
    private vehicleService: VehiclesService,
    private toaster: ToastrService
  ) {}

  ngOnInit(): void {
    this.vehicleFormGroup = this.formBuilder.group({
      plateNumber: ['', [Validators.required]],
      vehicleType: ['', [Validators.required]],
      brand: ['', [Validators.required]],
      model: ['', [Validators.required]],
      year: [''],
      color: [''],
      company: [''],
      isExternal: [false, [Validators.required]],
      isActive: [true, [Validators.required]],
      isAvailable: [true, [Validators.required]],
      registrationCard: [''],
      insuranceCard: [''],
      owner: ['']
    });

    if (this.formMode == 'EDIT' && this.initialData) {
      this.vehicleFormGroup.patchValue(this.initialData as Vehicle);
    }

    //deshabilitar fotos
    this.vehicleFormGroup.get('registrationCard').disable();
    this.vehicleFormGroup.get('insuranceCard').disable();

    // obtener listas requeridas de las que depende el componente
    //build Company List for Selecte
    this.getCompanyList();
    this.getPersonList();
  }

  getCompanyList() {
    this.companyService
      .getData()
      .toPromise()
      .then(response => {
        if (!response) {
          this.toaster.error('No hay datos de compañías!');
          return;
        }
        this.companies = response.objects;
        switch (this.formMode) {
          case 'ADD':
            this.companyList = this.companies.filter(company => company.isActive == true);
            break;
          default:
            this.companyList = this.companies;
        }
      })
      .catch(err => {
        this.toaster.error(err.message);
      });
  }
  getPersonList(isExternal: boolean = false) {
    this.personService
      .getData()
      .toPromise()
      .then(response => {
        if (!response) {
          this.toaster.error('No hay datos de personas!');
          return;
        }
        this.people = response.objects;

        this.personList = this.people;
      })
      .catch(err => {
        this.toaster.error(err.message);
      });
  }

  updatePicture(fieldName: string, id: string) {
    //update picture data
    var files: File[] = [];
    if (fieldName == 'registrationCard') files = this.filesRegistrationCard;

    if (fieldName == 'insuranceCard') files = this.filesInsuranceCard;

    this.vehicleService
      .updatePicture(fieldName, id, files[0])
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

  // PROPIEDADES
  get company() {
    return this.vehicleFormGroup.get('company');
  }
  get owner() {
    return this.vehicleFormGroup.get('owner');
  }

  /**
   * Resetea el valor de todos los campos
   */
  onReset() {
    this.vehicleFormGroup.reset();
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
    if (!this.vehicleFormGroup.valid) {
      this.toaster.warning('El formulario tiene erorres!');
      return;
    }

    this.vehicle = <Vehicle>this.vehicleFormGroup.value;

    this.vehicle.registrationCard = this.vehicleFormGroup.get('registrationCard').value;
    this.vehicle.insuranceCard = this.vehicleFormGroup.get('insuranceCard').value;

    switch (this.formMode) {
      case 'EDIT':
        this.vehicleService
          .updateData(this.initialData._id, this.vehicle)
          .toPromise()
          .then(resp => {
            if (!resp) {
              this.toaster.error('Operación fallida!');
              return;
            }

            this.vehicle = <Vehicle>resp.updated;

            if (this.filesRegistrationCard.length > 0)
              //nueva foto de registro
              this.updatePicture('registrationCard', this.vehicle._id);

            if (this.filesInsuranceCard.length > 0)
              //nueva foto de registro
              this.updatePicture('insuranceCard', this.vehicle._id);

            this.toaster.success('Operación exitosa!');
            this.changeState('RETRIEVE');
          })
          .catch(err => {
            this.toaster.error(err);
          });
        break;

      case 'ADD':
        this.vehicleService
          .addData(this.vehicle)
          .toPromise()
          .then(resp => {
            if (!resp) {
              this.toaster.error('Operación fallida!');
              return;
            }

            this.vehicle = <Vehicle>resp.created;

            if (this.filesRegistrationCard.length > 0)
              //nueva foto de registro
              this.updatePicture('registrationCard', this.vehicle._id);

            if (this.filesInsuranceCard.length > 0)
              //nueva foto de registro
              this.updatePicture('insuranceCard', this.vehicle._id);


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

  onSelectRegistracionCard(event) {
    console.log(event);
    if (this.filesRegistrationCard.length > 0) {
      this.filesRegistrationCard = [];
    }
    this.filesRegistrationCard.push(...event.addedFiles);
    this.vehicleFormGroup.get('registrationCard').setValue(this.filesRegistrationCard[0].name);
  }
  onSelectInsuranceCard(event) {
    console.log(event);
    if (this.filesInsuranceCard.length > 0) {
      this.filesInsuranceCard = [];
    }
    this.filesInsuranceCard.push(...event.addedFiles);
    this.vehicleFormGroup.get('insuranceCard').setValue(this.filesInsuranceCard[0].name);
  }
}

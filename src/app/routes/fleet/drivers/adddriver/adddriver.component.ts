import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatCheckboxChange } from '@angular/material/checkbox';
import {
  Driver,
  DriversService,
  Company,
  CompaniesService,
  Employee,
  EmployeesService,
  Person,
  PeopleService
} from 'app/services';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-adddriver',
  templateUrl: './adddriver.component.html',
  styleUrls: ['./adddriver.component.scss']
})
export class AdddriverComponent implements OnInit {
/**
   * Formulario de Agregar/Editar
   */
 driverFormGroup: FormGroup;
 driver: Driver;

 public companyList: any[] = [];
 public companies: any[] = [];

 public employeeList: any[] = [];
 public employees: any[] = [];

 public personList: any[] = [];
 public people: any[] = [];

 @Output() changeStateEvent = new EventEmitter<string>();

 @Input() formMode = 'ADD';
 @Input() initialData: any = {};

 constructor(
   private formBuilder: FormBuilder,
   private companyService: CompaniesService,
   private employeeService: EmployeesService,
   private personService: PeopleService,
   private driverService: DriversService,
   private toaster: ToastrService
 ) {}

 ngOnInit(): void {
   this.driverFormGroup = this.formBuilder.group({
     company: ['', [Validators.required]],
     person: ['', [Validators.required]],
     isExternal: [false, [Validators.required]],
     isActive: [true, [Validators.required]],
     isAvailable: [true, [Validators.required]],
     documents: this.formBuilder.group({
       licenseCard: ["", [Validators.required]],
       insuranceCard: ["", [Validators.required]],
     }),
     documentsComparison: this.formBuilder.group({
      licenseCard: [""],
      insuranceCard: [""],
      isOk: [true],
    }),
   });

   if (this.formMode == 'EDIT' && this.initialData) {
     this.driverFormGroup.patchValue(this.initialData as Driver);
   }

   // obtener listas requeridas de las que depende el componente
   //build Company List for Selecte
   this.getCompanyList();
   this.getPersonList(false); //primer llenado con personas que son empleadas
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

 getPersonList(isExternal:boolean=false) {
  this.personService
    .getData()
    .toPromise()
    .then(response => {
      if (!response) {
        this.toaster.error('No hay datos de personas!');
        return;
      }
      this.people = response.objects;

       /*switch (this.formMode) {
         case 'ADD':
           //validar si la llista de persona no es externa... filtrarla por las personas empleadas activas
           this.personList = this.people.filter(people => people.isEmployee == true);
           break;
         default:
           this.personList = this.people.filter(people => people.isEmployee == !isExternal);
       }*/
       //isExternal=true;
       this.personList = this.people.filter(people => people.isEmployee == !isExternal);
    })
    .catch(err => {
      this.toaster.error(err.message);
    });
}
// PROPIEDADES
 get company() {
   return this.driverFormGroup.get('company');
 }

 get person() {
  return this.driverFormGroup.get('person');
 }

get licenseCard() {
  return this.driverFormGroup.get('documents').get('licenseCard');
}

set licenseCard(value) {
  this.driverFormGroup.get('documents').get('licenseCard').setValue(value);
}

get insuranceCard() {
  return this.driverFormGroup.get('documents').get('insuranceCard');
}
set insuranceCard(value) {
  this.driverFormGroup.get('documents').get('insuranceCard').setValue(value);
}

 /**
  * Resetea el valor de todos los campos
  */
 onReset() {
   this.driverFormGroup.reset();
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
   if (!this.driverFormGroup.valid) {
     this.toaster.warning('El formulario tiene erorres!');
     return;
   }

   this.driver = <Driver>this.driverFormGroup.value;

   switch (this.formMode) {
     case 'EDIT':
       this.driverService
         .updateData(this.initialData._id, this.driver)
         .toPromise()
         .then(resp => {
           if (!resp) {
             this.toaster.error('Operación fallida!');
             return;
           }

           this.driver = <Driver>resp.updated;
           this.toaster.success('Operación exitosa!');
           this.changeState('RETRIEVE');
         })
         .catch(err => {
           this.toaster.error(err);
         });
       break;

     case 'ADD':
       this.driverService
         .addData(this.driver)
         .toPromise()
         .then(resp => {
           if (!resp) {
             this.toaster.error('Operación fallida!');
             return;
           }

           this.driver = <Driver>resp.created;
           this.toaster.success('Operación exitosa!');
           this.changeState('RETRIEVE');
         })
         .catch(err => {
           this.toaster.error(err.message);
         });
       break;

     default:
       this.toaster.warning('Se desconoce el modo del formulario');
   }
 }
 onChangeIsExternal(event: MatCheckboxChange) {
  this.getPersonList(event.checked);

 }
}

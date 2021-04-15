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

 public filesLicenseCard: File[]=[];
 public filesInsuranceCard: File[]=[];

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
     employee:[''],
     isExternal: [false, [Validators.required]],
     isActive: [true, [Validators.required]],
     isAvailable: [true, [Validators.required]],
     licenseCard: [""],
     insuranceCard: [""],
     documentsComparison: this.formBuilder.group({
      licenseCard: [""],
      insuranceCard: [""],
      isOk: [false],
    }),
   });

   if (this.formMode == 'EDIT' && this.initialData) {
     this.driverFormGroup.patchValue(this.initialData as Driver);
    this.getPersonList( this.driverFormGroup.get('isExternal').value)
   }
   else{ //entonces esta en modo ADD
    this.getPersonList(false); //primer llenado con personas que son empleadas
   }

   //build Company List for Selecte
   this.getCompanyList();
   this.getEmployeeList();


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

getEmployeeList() {
  this.employeeService
    .getData()
    .toPromise()
    .then(resp => {
      this.employeeList = resp.objects;
    });
}
// PROPIEDADES
 get company() {
   return this.driverFormGroup.get('company');
 }

 get person() {
  return this.driverFormGroup.get('person');
 }


updatePicture(fieldName: string, id: string) {
  //update picture data
  var files: File[] = [];
  if (fieldName == 'licenseCard') files = this.filesLicenseCard;

  if (fieldName == 'insuranceCard') files = this.filesInsuranceCard;

  this.driverService
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

   //this.driver.documents.licenseCard  =  this.driverFormGroup.get('documents').get('licenseCard').value;
   //this.driver.documents.insuranceCard = this.driverFormGroup.get('documents').get('insuranceCard').value;

   if (!this.driver.isExternal)
   { //obtener empleado
      var emp = this.employeeList.find(it => it._id == this.driver.person);
      this.driver.employee = !emp?null:emp._id;
   }
   else
      this.driver.employee=null;

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

           if (this.filesLicenseCard.length > 0)
              //nueva foto de registro
              this.updatePicture('licenseCard', this.driver._id);

            if (this.filesInsuranceCard.length > 0)
              //nueva foto de registro
              this.updatePicture('insuranceCard', this.driver._id);



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

           if (this.filesLicenseCard.length > 0)
              //nueva foto de registro
              this.updatePicture('licenseCard', this.driver._id);

            if (this.filesInsuranceCard.length > 0)
              //nueva foto de registro
              this.updatePicture('insuranceCard', this.driver._id);


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

 onSelectLicenseCard(event) {
  console.log(event);
  if (this.filesLicenseCard.length > 0) {
    this.filesLicenseCard = [];
  }
  this.filesLicenseCard.push(...event.addedFiles);
  this.driverFormGroup.get('licenseCard').setValue(this.filesLicenseCard[0].name);
}
onSelectInsuranceCard(event) {
  console.log(event);
  if (this.filesInsuranceCard.length > 0) {
    this.filesInsuranceCard = [];
  }
  this.filesInsuranceCard.push(...event.addedFiles);
  this.driverFormGroup.get('insuranceCard').setValue(this.filesInsuranceCard[0].name);
}
}

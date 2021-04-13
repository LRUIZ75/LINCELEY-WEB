import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatCheckboxChange } from '@angular/material/checkbox';
import {
  Vehicle,
  VehiclesService,
  Company,
  CompaniesService
} from 'app/services';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-addvehicle',
  templateUrl: './addvehicle.component.html',
  styleUrls: ['./addvehicle.component.scss']
})
export class AddvehicleComponent implements OnInit {
/**
   * Formulario de Agregar/Editar
   */
 vehicleFormGroup: FormGroup;
 vehicle: Vehicle;

 public companyList: any[] = [];
 public companies: any[] = [];

 @Output() changeStateEvent = new EventEmitter<string>();

 @Input() formMode = 'ADD';
 @Input() initialData: any = {};

 constructor(
   private formBuilder: FormBuilder,
   private companyService: CompaniesService,
   private vehicleService: VehiclesService,
   private toaster: ToastrService
 ) {}

 ngOnInit(): void {
   this.vehicleFormGroup = this.formBuilder.group({
     plateNumber:['', [Validators.required]],
     vehicleType:['', [Validators.required]],
     brand:['', [Validators.required]],
     model: ['', [Validators.required]],
     year: '',
     color: '',
     company: '',
     isExternal: [false, [Validators.required]],
     isActive: [true, [Validators.required]],
     isAvailable: [true, [Validators.required]],
     registrationCard: '',
     insuranceCard: '',
     owner: '',
   });

   if (this.formMode == 'EDIT' && this.initialData) {
     this.vehicleFormGroup.patchValue(this.initialData as Vehicle);
   }

   // obtener listas requeridas de las que depende el componente
   //build Company List for Selecte
   this.getCompanyList();
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


// PROPIEDADES
 get company() {
   return this.vehicleFormGroup.get('company');
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
 
}

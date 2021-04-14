import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import {
 ServiceshedulesService,
 ServiceStatus,
 ServiceSchedule,
 VehiclesService,
 Vehicle,
 VehicleType
} from 'app/services';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-addservschedule',
  templateUrl: './addservschedule.component.html',
  styleUrls: ['./addservschedule.component.scss']
})
export class AddservscheduleComponent implements OnInit {
/**
   * Formulario de Agregar/Editar
   */
 scheduleFormGroup: FormGroup;
 schedule: ServiceSchedule;


 public vehicles: any[] = [];
 public vehicleList: any[] = [];
 public termList: any[] = [];
 public serviceStatusList: any[] = [];
 public startDate: Date;

 @Output() changeStateEvent = new EventEmitter<string>();

 @Input() formMode = 'ADD';
 @Input() initialData: any = {};

 constructor(
   private formBuilder: FormBuilder,
   private scheduleService: ServiceshedulesService,
   private vehicleService: VehiclesService,
   private toaster: ToastrService,
   private translate: TranslateService
 ) {}

 ngOnInit(): void {
   this.scheduleFormGroup = this.formBuilder.group({
     vehicle: ['', [Validators.required]],
     serviceStatus: ['', [Validators.required]],
     startDate: ['', [Validators.required]],
     term: ['', [Validators.required]],
     repeatEvery: [''],
     comments: [''],
     isActive: [true],
   });

   if (this.formMode == 'EDIT' && this.initialData) {
     this.scheduleFormGroup.patchValue(this.initialData as ServiceSchedule);
   }


   this.getStatusList();
   this.getVehicleList();
 }

 getStatusList() {

/* 
    AVAILABLE = 'AVAILABLE',
    SERVICING = 'SERVICING', //MANTENIMIENTO
    ONDUTY = 'ON-DUTY' //DE SERVICIO
   */


    this.serviceStatusList.push({
      id: ServiceStatus.AVAILABLE, 
      text:  this.translate.instant(ServiceStatus.AVAILABLE)
    });

    this.serviceStatusList.push({
      id: ServiceStatus.SERVICING, 
      text:  this.translate.instant(ServiceStatus.SERVICING)
    });

    this.serviceStatusList.push({
      id: ServiceStatus.ONDUTY, 
      text:  this.translate.instant(ServiceStatus.ONDUTY)
    });

  
 }



 getVehicleList() {
   this.vehicleService
     .getData()
     .toPromise()
     .then(response => {
       if (!response) {
         this.toaster.error('No hay datos de vehículos!');
         return;
       }
       this.vehicles = response.objects as Vehicle[];
       switch (this.formMode) {
         case 'ADD':
           this.vehicleList = this.vehicles.filter(roles => roles.isActive == true);
           break;
         default:
           this.vehicleList = this.vehicles;
       }
     })
     .catch(err => {
       this.toaster.error(err.message);
     });
 }



 /**
  * Resetea el valor de todos los campos
  */
 onReset() {
   this.scheduleFormGroup.reset();
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
   if (!this.scheduleFormGroup.valid) {
     this.toaster.warning('El formulario tiene erorres!');
     return;
   }

   this.schedule = <ServiceSchedule> this.scheduleFormGroup.value;

   switch (this.formMode) {
     case 'EDIT':
       this.scheduleService
         .updateData(this.initialData._id, this.schedule)
         .toPromise()
         .then(resp => {
           if (!resp) {
             this.toaster.error('Operación fallida!');
             return;
           }

           this.schedule = <ServiceSchedule>resp.updated;
           this.toaster.success('Operación exitosa!');
           this.changeState('RETRIEVE');
         })
         .catch(err => {
           this.toaster.error(err);
         });
       break;

     case 'ADD':
       this.scheduleService
         .addData(this.schedule)
         .toPromise()
         .then(resp => {
           if (!resp) {
             this.toaster.error('Operación fallida!');
             return;
           }

           this.schedule = <ServiceSchedule>resp.created;
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

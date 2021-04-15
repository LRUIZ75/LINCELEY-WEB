import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import {
  ServiceshedulesService,
  ServiceStatus,
  ServiceSchedule,
  DriversService,
  Driver,
  Person,
  PeopleService,
  VehiclesService,
  Vehicle,
  VehicleType,
  Assignment,
  AssignmentsService,
} from 'app/services';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-addassignment',
  templateUrl: './addassignment.component.html',
  styleUrls: ['./addassignment.component.scss'],
})
export class AddassignmentComponent implements OnInit {
  /**
   * Formulario de Agregar/Editar
   */
  assignmentFormGroup: FormGroup;
  assignment: Assignment;

  public driverList: any[] = [];
  public drivers: any[] = [];

  public vehicles: any[] = [];
  public vehicleList: any[] = [];
  public termList: any[] = [];
  public serviceStatusList: any[] = [];
  public startDate: Date;

  @Output() changeStateEvent = new EventEmitter<string>();

  @Input() formMode = 'ADD';
  @Input() initialData: any = {};

  public personList: any[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private assignmentService: AssignmentsService,
    private scheduleService: ServiceshedulesService,
    private vehicleService: VehiclesService,
    private driverService: DriversService,
    private peopleService: PeopleService,
    private toaster: ToastrService,
    private translate: TranslateService
  ) {}

  ngOnInit(): void {
    var today = new Date().toISOString();
    this.assignmentFormGroup = this.formBuilder.group({
      assignmentDate: [today, [Validators.required]],
      driver: ['', [Validators.required]],
      vehicle: ['', [Validators.required]],
    });

    if (this.formMode == 'EDIT' && this.initialData) {
      this.assignmentFormGroup.patchValue(this.initialData as ServiceSchedule);
    }

    this.getPersonList();
    this.getStatusList();
    this.getDriverList();
    this.getVehicleList();
  }

  getPersonList() {
    this.peopleService
      .getData()
      .toPromise()
      .then(data => {
        this.personList = data.objects;
      });
  }

  getStatusList() {
    /* 
    AVAILABLE = 'AVAILABLE',
    SERVICING = 'SERVICING', //MANTENIMIENTO
    ONDUTY = 'ON-DUTY' //DE SERVICIO
   */

    this.serviceStatusList.push({
      id: ServiceStatus.AVAILABLE,
      text: this.translate.instant(ServiceStatus.AVAILABLE),
    });

    this.serviceStatusList.push({
      id: ServiceStatus.SERVICING,
      text: this.translate.instant(ServiceStatus.SERVICING),
    });

    this.serviceStatusList.push({
      id: ServiceStatus.ONDUTY,
      text: this.translate.instant(ServiceStatus.ONDUTY),
    });
  }

  getDriverList() {
    this.driverService
      .getData()
      .toPromise()
      .then(response => {
        if (!response) {
          this.toaster.error('No hay datos de repartidores!');
          return;
        }
        this.drivers = response.objects;
        switch (this.formMode) {
          case 'ADD':
            this.drivers = this.drivers.filter(v => v.isActive && v.isAvailable);
            break;
          default:
            this.drivers = this.drivers.filter(v => v.isActive);
        }

        for (var i = 0; i < this.drivers.length; i++) {
          var person = <Person> this.personList.find(p => p._id == this.drivers[i].person);
          if (person)
            this.drivers[i].driverDescription =
              person.names + ' ' + person.lastNames + (this.drivers[i].isExternal == true?" (EXT)": " (EMP)");
        }
      })
      .catch(err => {
        this.toaster.error(err.message);
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
        this.vehicles = response.objects;
        switch (this.formMode) {
          case 'ADD':
            this.vehicles = this.vehicles.filter(v => v.isActive && v.isAvailable);
            break;
          default:
            this.vehicles = this.vehicles.filter(v => v.isActive);
        }
        for (var i = 0; i < this.vehicles.length; i++) {
          this.vehicles[i].vehicleDescription =
            this.vehicles[i].plateNumber +
            ' ' +
            this.translate.instant(this.vehicles[i].vehicleType) +
            ' [' +
            this.vehicles[i].brand +
            ' ' +
            this.vehicles[i].model +
            ' ' +
            this.vehicles[i].year + "]";
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
    this.assignmentFormGroup.reset();
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
    if (!this.assignmentFormGroup.valid) {
      this.toaster.warning('El formulario tiene erorres!');
      return;
    }

    this.assignment = <Assignment>this.assignmentFormGroup.value;

    switch (this.formMode) {
      case 'EDIT':
        this.assignmentService
          .updateData(this.initialData._id, this.assignment)
          .toPromise()
          .then(resp => {
            if (!resp) {
              this.toaster.error('Operación fallida!');
              return;
            }

            this.assignment = <Assignment>resp.updated;
            this.toaster.success('Operación exitosa!');
            this.driverService.updateData(this.initialData.driver,{"isAvailable": "true"});
            this.vehicleService.updateData(this.initialData.vehicle,{"isAvailable": "true"});    
            this.driverService.updateData(this.assignment.driver,{"isAvailable": "false"});
            this.vehicleService.updateData(this.assignment.vehicle,{"isAvailable": "false"});
            this.changeState('RETRIEVE');
          })
          .catch(err => {
            this.toaster.error(err);
          });
        break;

      case 'ADD':
        this.assignmentService
          .addData(this.assignment)
          .toPromise()
          .then(resp => {
            if (!resp) {
              this.toaster.error('Operación fallida!');
              return;
            }

            this.assignment = <Assignment>resp.created;
            this.toaster.success('Operación exitosa!');   
            this.driverService.updateData(this.assignment.driver,{"isAvailable": "false"})
            .toPromise().then();
            this.vehicleService.updateData(this.assignment.vehicle,{"isAvailable": "false"})
            .toPromise().then();
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

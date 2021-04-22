import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import {
  DriversService,
  VehiclesService,
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

  public drivers: any[] = [];
  public vehicles: any[] = [];

  @Output() changeStateEvent = new EventEmitter<string>();

  @Input() formMode = 'ADD';
  @Input() initialData: any = {};

  constructor(
    private formBuilder: FormBuilder,
    private assignmentService: AssignmentsService,
    private vehicleService: VehiclesService,
    private driverService: DriversService,
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
      this.assignmentFormGroup.patchValue(this.initialData as Assignment);
    }

    this.getDriverList();
    this.getVehicleList();
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

        this.drivers.forEach(d => {
          d.driverDescription = !d.person
            ? ''
            : d.person.names +
              ' ' +
              d.person.lastNames +
              ' ' +
              (d.isExternal == true ? ' (Ext)' : '(Emp)');
        });
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
        this.vehicles.forEach(v => {
          v.vehicleDescription =
            v.plateNumber +
            ' ' +
            this.translate.instant(v.vehicleType) +
            ' [' +
            v.brand +
            ' ' +
            v.model +
            ' ' +
            v.year +
            ']';
        });
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
            this.driverService.updateData(this.initialData.driver, { isAvailable: 'true' });
            this.vehicleService.updateData(this.initialData.vehicle, { isAvailable: 'true' });
            this.driverService.updateData(this.assignment.driver, { isAvailable: 'false' });
            this.vehicleService.updateData(this.assignment.vehicle, { isAvailable: 'false' });
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
            this.driverService
              .updateData(this.assignment.driver, { isAvailable: 'false' })
              .toPromise()
              .then();
            this.vehicleService
              .updateData(this.assignment.vehicle, { isAvailable: 'false' })
              .toPromise()
              .then();
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

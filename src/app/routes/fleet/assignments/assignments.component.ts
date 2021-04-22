import { Component, OnInit } from '@angular/core';
import { CdkDragStart } from '@angular/cdk/drag-drop';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '@shared/components/confirm-dialog/confirm-dialog.component';

//Import services
import {
  DriversService,
  PeopleService,
  VehiclesService,
  ServiceshedulesService,
  Assignment,
  AssignmentsService,
} from 'app/services';

import { DataTableTranslations } from 'ornamentum';

@Component({
  selector: 'app-fleet-assignments',
  templateUrl: './assignments.component.html',
  styleUrls: ['./assignments.component.scss'],
  providers: [DriversService, VehiclesService, ServiceshedulesService],
})
export class FleetAssignmentsComponent implements OnInit {
  /* Variables locales */

  public currentState: string = 'RETRIEVE';
  public selected: Assignment;

  public assignmentList: any[] = [];
  public defaultDate: string;

  public title: string;
  public personNames: string;
  public today = new Date().toISOString();

  dragging = false;
  opened = false;

  public dataTableTranslations: DataTableTranslations;

  getDataTableTranslations(): DataTableTranslations {
    this.dataTableTranslations = {
      pagination: {
        limit: this.translate.instant('pagination.limit'),
        rangeKey: this.translate.instant('pagination.records'),
        rangeSeparator: this.translate.instant('pagination.of'),
        nextTooltip: this.translate.instant('pagination.next'),
        previousTooltip: this.translate.instant('pagination.previous'),
        lastTooltip: this.translate.instant('pagination.last'),
        firstTooltip: this.translate.instant('pagination.first'),
      },
      noDataMessage: this.translate.instant('notifications.nodata'),
      dropdownFilter: {
        filterPlaceholder: this.translate.instant('record_actions.search'),
        selectPlaceholder: this.translate.instant('record_actions.search'),
      },
      columnSelector: { header: '>>' },
    };
    return this.dataTableTranslations;
  }

  constructor(
    public vehicleService: VehiclesService,
    public driverService: DriversService,
    public peopleService: PeopleService,
    public scheduleService: ServiceshedulesService,
    public assignmentService: AssignmentsService,
    public translate: TranslateService,
    public toaster: ToastrService,
    private confirmDialog: MatDialog
  ) {
    this.title = this.translate.instant('domain.assigments');
    this.getList();
  }
  getTitle() {
    this.title = this.translate.instant('domain.assignments');
    return this.title;
  }
  ngOnInit() {
    /*     if('geolocation' in navigator) {
      console.log('geolocation is available');
    } else {
      console.log('geolocation is NOT available');
    } */
    this.defaultDate = Date.now().toString();

    this.currentState = 'RETRIEVE';
  }

  getList() {
    this.assignmentService
      .getData()
      .toPromise()
      .then(
        async resp => {
          if (resp.status != 'ok') return;
          this.assignmentList = resp.objects;



          this.assignmentList.forEach(a => {
            a.vehicleDescription = !a.vehicle
              ? ''
              : a.vehicle.plateNumber +
                ' - ' +
                a.vehicle.vehicleType +
                ': ' +
                a.vehicle.brand +
                ' ' +
                a.vehicle.model +
                ' ' +
                a.vehicle.year;

            a.assignmentDate = a.assignmentDate.substring(0, 10);

            a.driverDescription = !a.driver.person
              ? ''
              : a.driver.person.names + ' ' + a.driver.person.lastNames;
          });

          this.today = new Date().toISOString().substring(0, 10);
          //TODO: Reactivar este comentario para filtrar solo el diario
          this.assignmentList = this.assignmentList.filter(a => a.assignmentDate == this.today);
        },
        err => {
          if (err.substring(0, 3) != '404') {
            var msg = this.translate.stream('record_actions.error_occurred');
            this.toaster.error(err);
          }
        }
      );
  }

  getDateISOString(date: Date): string {
    return date.toISOString().substring(0, 10);
  }

  handleDragStart(event: CdkDragStart): void {
    this.dragging = true;
  }

  openPanel(event: MouseEvent) {
    if (this.dragging) {
      this.dragging = false;
      return;
    }
    this.selected = undefined;
    this.opened = true;
    this.currentState = 'ADD';
  }

  edit(selected) {
    this.selected = selected;
    //depopulate
    this.selected.driver = selected.driver._id;
    this.selected.vehicle = selected.vehicle._id;
    this.selected = <Assignment>this.selected;

    this.opened = true;
    this.currentState = 'EDIT';
  }

  delete(selected) {
    this.selected = selected;

    this.assignmentService
      .deleteData(selected._id)
      .toPromise()
      .then(deleted => {
        if (deleted) {
          this.toaster.success('Operación exitosa!');
          this.getList();
        } else {
          this.toaster.error('Operación fallida!');
          return;
        }
      })
      .catch(err => {
        this.toaster.error(err);
        return;
      });
  }

  confirmDelete(selected) {
    const confirmDialog = this.confirmDialog.open(ConfirmDialogComponent, {
      data: {
        title: this.translate.instant('record_actions.deactivate'),
        //ODEM Cambiar la propiedad de select
        message:
          this.translate.instant('notifications.can_deactivate') +
          ': ' +
          selected.vehicleDescription +
          ' - ' +
          selected.driverDescription +
          ' ?',
        button1Text: this.translate.instant('buttons.yes').toUpperCase(),
        button2Text: this.translate.instant('buttons.no').toUpperCase(),
      },
    });

    confirmDialog.afterClosed().subscribe(result => {
      if (result == true) this.delete(selected);
    });
  }

  changeState(state: string) {
    this.currentState = state;
    if (state == 'RETRIEVE') this.getList();
  }
}

import { Component, OnInit } from '@angular/core';
import { CdkDragStart } from '@angular/cdk/drag-drop';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '@shared/components/confirm-dialog/confirm-dialog.component';

//Import services
import {
  Driver,
  DriversService,
  Person,
  PeopleService,
  Vehicle,
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

  public driverList: any[] = [];
  public personList: any[] = [];
  public person: Person;
  public vehicleList: any[] = [];

  public assignmentList: any[] = [];
  public defaultDate: string;

  public title: string;
  public personNames: string;
  public today = new Date().toISOString();

  dragging = false;
  opened = false;

  public dataTableTranslations: DataTableTranslations = {
    pagination: {
      limit: this.translate.instant('pagination.limit'),
      rangeKey: this.translate.instant('pagination.records'),
      rangeSeparator: this.translate.instant('pagination.of'),
      nextTooltip: this.translate.instant('pagination.next'),
      previousTooltip: this.translate.instant('pagination.previous'),
      lastTooltip: this.translate.instant('pagination.last'),
      firstTooltip: this.translate.instant('pagination.first'),
    },
  };

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
       selectPlaceholder: this.translate.instant('record_actions.search')
     },
     columnSelector: { header: ">>"}


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
    this.getDriverList();
    this.getPersonList();
    this.getVehicleList();
    this.getList();
  }
  getTitle()
  {
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

  getDriverList() {
    this.driverService
      .getData()
      .toPromise()
      .then(resp => {
        this.driverList = resp.objects as Driver[];
      });
  }

  getPersonList() {
    this.peopleService
      .getData()
      .toPromise()
      .then(resp => {
        this.personList = resp.objects as Person[];
      });
  }

  getVehicleList() {
    this.vehicleService
      .getData()
      .toPromise()
      .then(resp => {
        this.vehicleList = resp.objects as Vehicle[];
      });
  }

  getList() {

    this.assignmentService
      .getData()
      .toPromise()
      .then(
        async resp => {
          if (resp.status != 'ok') return;
          this.assignmentList = resp.objects;

          for (var i = 0; i < this.assignmentList.length; i++) {
            var veh = this.vehicleList.find(ve => ve._id == this.assignmentList[i].vehicle);
            this.assignmentList[i].driverDescription = '';
            this.assignmentList[i].vehicleDescription = !veh
              ? ''
              : veh.plateNumber +
                ' - ' +
                veh.vehicleType +
                ': ' +
                veh.brand +
                ' ' +
                veh.model +
                ' ' +
                veh.year;
            var driver = this.driverList.find(drv => drv._id == this.assignmentList[i].driver);

            if (driver.person) {
              /*               var promise = this.getPerson(driver.person);
              //let persona:any = {};
              await promise.then(value => {
                this.person = value;
              });

              this.assignmentList[i].driverDescription = this.person.names + ' ' + this.person.lastNames
 */

              var person = this.personList.find(p => p._id == driver.person);
              this.assignmentList[i].driverDescription = person.names + ' ' + person.lastNames;
              this.assignmentList[i].assignmentDate = this.assignmentList[
                i
              ].assignmentDate.substring(0, 10);
            }
          }
          //this.assignmentList = this.assignmentList.sort((a,b)=> (a.assignmentDate - b.assignmentDate));
          this.today = new Date().toISOString().substring(0, 10);
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

  getPerson(id: string): Promise<Person> {
    var promise = new Promise<Person>((resolve, reject) => {
      this.peopleService
        .getDataById(id)
        .toPromise()
        .then(data => {
          if (!data) reject('no hay datos');
          resolve(data.objects[0]);
        })
        .catch(err => {
          reject(err);
        });
    });
    return promise;
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
        message: this.translate.instant('notifications.can_deactivate') + ': ' + selected.vehicleDescription + ' - ' + selected.driverDescription +   ' ?',
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

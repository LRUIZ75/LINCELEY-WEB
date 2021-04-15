import { Component, OnInit } from '@angular/core';
import { CdkDragStart } from '@angular/cdk/drag-drop';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { MtxGridColumn } from '@ng-matero/extensions';

//Import services
import {
  Driver,
  DriversService,
  Person,
  PeopleService,
  Vehicle,
  VehiclesService,
  ServiceStatus,
  ServiceSchedule,
  ServiceshedulesService,
  Assignment,
  AssignmentsService,
} from 'app/services';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-fleet-assignments',
  templateUrl: './assignments.component.html',
  styleUrls: ['./assignments.component.scss'],
  providers: [DriversService, VehiclesService, ServiceshedulesService],
})
export class FleetAssignmentsComponent implements OnInit {
  columns: MtxGridColumn[] = [
    {
      header: this.translate.stream('Id'),
      field: '_id',
      hide: true,
      sortable: true,
    },
    {
      header: this.translate.stream('domain.assignmentdate'),
      field: 'assignmentDate',
      sortable: true,
    },
    {
      header: this.translate.stream('domain.vehicle'),
      field: 'vehicle',
      sortable: true,
      disabled: true,
      hide: true,
    },
    {
      header: this.translate.stream('domain.vehicle'),
      field: 'vehicleDescription',
      sortable: true,
    },
    {
      header: this.translate.stream('domain.driver'),
      field: 'driver',
      sortable: true,
      hide: true,
    },
    {
      header: this.translate.stream('domain.driver'),
      field: 'driverDescription',
      sortable: true,
    },
    {
      header: this.translate.stream('table_kitchen_sink.operation'),
      field: 'operation',
      width: '120px',
      pinned: 'right',
      right: '0px',
      type: 'button',
      buttons: [
        {
          type: 'icon',
          icon: 'edit',
          tooltip: this.translate.stream('table_kitchen_sink.edit'),
          click: record => this.edit(record),
        },
        {
          color: 'warn',
          icon: 'delete',
          text: this.translate.stream('table_kitchen_sink.delete'),
          tooltip: this.translate.stream('table_kitchen_sink.delete'),
          pop: true,
          popTitle: this.translate.stream('table_kitchen_sink.confirm_delete'),
          popCloseText: this.translate.stream('table_kitchen_sink.close'),
          popOkText: this.translate.stream('table_kitchen_sink.ok'),
          click: record => this.delete(record),
        },
      ],
    },
  ];
  isLoading = true;

  multiSelectable = false;
  rowSelectable = true;
  hideRowSelectionCheckbox = false;
  showToolbar = false;
  columnHideable = true;
  columnMovable = true;
  rowHover = true;
  rowStriped = true;
  showPaginator = true;
  expandable = false;

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
public today = new Date().toISOString();;

  dragging = false;
  opened = false;

  constructor(
    public vehicleService: VehiclesService,
    public driverService: DriversService,
    public peopleService: PeopleService,
    public scheduleService: ServiceshedulesService,
    public assignmentService: AssignmentsService,
    public translate: TranslateService,
    public toaster: ToastrService
  ) {
    this.title = this.translate.instant('domain.assigments');
    this.getDriverList();
    this.getPersonList();
    this.getVehicleList();
    this.getList();
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
    this.isLoading = true;
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
              this.assignmentList[i].assignmentDate = this.assignmentList[i].assignmentDate.substring(0,10);
            }
          }
          //this.assignmentList = this.assignmentList.sort((a,b)=> (a.assignmentDate - b.assignmentDate));
          this.today =new Date().toISOString().substring(0,10);
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

   getDateISOString( date: Date) : string {
    return date.toISOString().substring(0, 10);
  }

  getPerson(id: string): Promise<Person> {
    var promise = new Promise<Person>( (resolve, reject) => {
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

    this.scheduleService
      .deactivateData(selected._id)
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

  changeState(state: string) {
    this.currentState = state;
    if (state == 'RETRIEVE') this.getList();
  }

  changeSelect(e: any) {
    console.log(e);
  }

  changeSort(e: any) {
    console.log(e);
  }

  enableRowExpandable() {
    this.columns[0].showExpand = this.expandable;
  }
}


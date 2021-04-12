import { Component, OnInit } from '@angular/core';
import { CdkDragStart } from '@angular/cdk/drag-drop';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { MtxGridColumn } from '@ng-matero/extensions';

//Import services
import {
  Company,
  CompaniesService,
  Vehicle,
  VehiclesService,
  ServiceStatus,
  ServiceSchedule,
  ServiceshedulesService,
} from 'app/services';

@Component({
  selector: 'app-fleet-serviceschedules',
  templateUrl: './serviceschedules.component.html',
  styleUrls: ['./serviceschedules.component.scss'],
  providers: [CompaniesService, VehiclesService, ServiceshedulesService],
})
export class FleetServiceschedulesComponent implements OnInit {
  columns: MtxGridColumn[] = [
    {
      header: this.translate.stream('Id'),
      field: '_id',
      hide: true,
      sortable: true,
    },
    {
      header: this.translate.stream('domain.vehicle'),
      field: 'vehicle',
      sortable: true,
      disabled: true,
      hide: true,
    },
    { header: this.translate.stream('domain.vehicle'), field: 'vehiclePlate', sortable: true },
    {
      header: this.translate.stream('domain.servicestatus'),
      field: 'serviceStatus',
      sortable: true,
    },
    { header: this.translate.stream('domain.startschedule'), field: 'startDate' },
    { header: this.translate.stream('domain.term'), field: 'term' },
    { header: this.translate.stream('domain.repeatevery'), field: 'repeatEvery' },
    {
      header: this.translate.stream('domain.isActive'),
      field: 'isActive',
      sortable: true,
      type: 'boolean',
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
  public selected: ServiceSchedule;

  public companyList: any[] = [];
  public vehicleList: any[] = [];

  public scheduleList: any[] = [];

  public title: string;
  dragging = false;
  opened = false;

  constructor(
    public companyService: CompaniesService,
    public vehicleService: VehiclesService,
    public scheduleService: ServiceshedulesService,
    public translate: TranslateService,
    public toaster: ToastrService
  ) {
    this.title = this.translate.instant('domain.serviceschedules');
    this.getCompanyList();
    this.getVehicleList();
    this.getList();
  }

  ngOnInit() {
    /*     if('geolocation' in navigator) {
      console.log('geolocation is available');
    } else {
      console.log('geolocation is NOT available');
    } */

    this.currentState = 'RETRIEVE';
  }

  getCompanyList() {
    this.companyService
      .getData()
      .toPromise()
      .then(resp => {
        this.companyList = resp.objects;
      });
  }

  getVehicleList() {
    this.vehicleService
      .getData()
      .toPromise()
      .then(resp => {
        this.vehicleList = resp.objects;
      });
  }

  getList() {
    this.isLoading = true;
    this.scheduleService.getData().subscribe(
      res => {
        if (res) {
          var jsonResponse = JSON.stringify(res);
          var response = JSON.parse(jsonResponse);
          if (response.status != 'ok') return;
          this.scheduleList = response.objects;
          this.scheduleList = this.scheduleList.filter(it => it.isActive == true);

          for (var i = 0; i < this.scheduleList.length; i++) {
            var veh = this.vehicleList.find(ve => ve._id == this.scheduleList[i].vehicle);
            this.scheduleList[i].vehiclePlate = !veh ? '' : veh.plateNumber;
            //traducir inemdiatamente los valores de estado de servicio
            this.scheduleList[i].serviceStatus = this.translate.instant(
              this.scheduleList[i].serviceStatus
            );
          }
        }
      },
      err => {
        if (err.substring(0, 3) != '404') {
          var msg = this.translate.instant('record_actions.error_occurred');
          this.toaster.error(err);
        }
      }
    );
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

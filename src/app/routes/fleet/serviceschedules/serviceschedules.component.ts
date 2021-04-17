import { Component, OnInit } from '@angular/core';
import { CdkDragStart } from '@angular/cdk/drag-drop';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '@shared/components/confirm-dialog/confirm-dialog.component';

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

import { DataTableTranslations } from 'ornamentum';

@Component({
  selector: 'app-fleet-serviceschedules',
  templateUrl: './serviceschedules.component.html',
  styleUrls: ['./serviceschedules.component.scss'],
  providers: [CompaniesService, VehiclesService, ServiceshedulesService],
})
export class FleetServiceschedulesComponent implements OnInit {

  /* Variables locales */

  public currentState: string = 'RETRIEVE';
  public selected: ServiceSchedule;

  public companyList: any[] = [];
  public vehicleList: any[] = [];

  public scheduleList: any[] = [];

  public title: string;
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
    public companyService: CompaniesService,
    public vehicleService: VehiclesService,
    public scheduleService: ServiceshedulesService,
    public translate: TranslateService,
    public toaster: ToastrService,
    private confirmDialog: MatDialog
  ) {
    this.title = this.translate.instant('domain.serviceschedules');
    this.getCompanyList();
    this.getVehicleList();
    this.getList();
  }

  getTitle()
  {
    this.title = this.translate.instant('domain.serviceschedule');
    return this.title;
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
  getDateISOString(date: Date): string {
    return date.toISOString().substring(0, 10);
  }
  getList() {

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
            this.scheduleList[i].vehicleDescription = !veh ? '' : veh.plateNumber + ' - '
            +  veh.vehicleType + ': ' +veh.brand + ' ' + veh.model + ' ' + veh.year ;

            this.scheduleList[i].startDate = this.scheduleList[i].startDate.substring(0, 10);
            //traducir inemdiatamente los valores de estado de servicio
            this.scheduleList[i].serviceStatusName = this.translate.instant(
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

  confirmDelete(selected) {

    const confirmDialog = this.confirmDialog.open(ConfirmDialogComponent, {
      data: {
        title: this.translate.instant('record_actions.deactivate'),
      //ODEM Cambiar la propiedad de select
        message: this.translate.instant('notifications.can_deactivate') + ': ' + selected.vehicleDescription + ' ?',
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

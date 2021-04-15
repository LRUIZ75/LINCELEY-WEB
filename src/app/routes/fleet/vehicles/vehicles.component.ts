import { Component, OnInit, Input } from '@angular/core';
import { CdkDragStart } from '@angular/cdk/drag-drop';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { MtxGridColumn } from '@ng-matero/extensions';

//Import services
import { Company, CompaniesService, Vehicle, VehiclesService, Person, PeopleService} from 'app/services';



@Component({
  selector: 'app-fleet-vehicles',
  templateUrl: './vehicles.component.html',
  styleUrls: ['./vehicles.component.scss'],
  providers: [CompaniesService, VehiclesService]
})
export class FleetVehiclesComponent implements OnInit {
  columns: MtxGridColumn[] = [
    {
      header: this.translate.stream('Id'),
      field: '_id',
      hide: true,
      sortable: true,
    },
    {
      header: this.translate.stream('domain.platenumber') ,
      field: 'plateNumber',
      sortable: true,
      disabled: true,
    },
    { header: this.translate.stream('domain.description'), field: 'description', sortable:true },
    { header: this.translate.stream('domain.vehicletype'), field: 'vehicleType', sortable:true },
    { header: this.translate.stream('domain.company'), field: 'companyName', sortable:true },
    { header: this.translate.stream('domain.owner'), field: 'ownerName', sortable:true },
    { header: this.translate.stream('domain.isActive'), field: 'isActive', sortable:true, type: 'boolean' },
    { header: this.translate.stream('domain.isexternal'), field: 'isExternal' },
    { header: this.translate.stream('domain.isavailable'), field: 'isAvailable' },
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
  public selected:  Vehicle;

  public vehicleList: any[]=[];
  public companyList: any[] = [];
  public personList: any[]=[];
  public title: string;
  dragging = false;
  opened = false;

  getCompanyList() {
    this.companyService
      .getData()
      .toPromise()
      .then(resp => {
        this.companyList = resp.objects;
      });
  }

  getPersonList() {
    this.personService
      .getData()
      .toPromise()
      .then(resp => {
        this.personList = resp.objects;
      });
  }


  @Input() filter: string = '';
  constructor(
    public companyService: CompaniesService,
    public personService: PeopleService,
    public vehicleService: VehiclesService,
    public translate: TranslateService,
    public toaster: ToastrService
  ) {
    this.title = this.translate.instant('domain.vehicles');
    this.getCompanyList();
    this.getPersonList();
    this.getList();
  }

  ngOnInit() {

    if('geolocation' in navigator) {
      console.log('geolocation is available');
    } else {
      console.log('geolocation is NOT available');
    }

  }

  getList() {
    this.isLoading=true;
    this.vehicleService.getData().subscribe(
      res => {
        if (res) {
            var jsonResponse = JSON.stringify(res);
            var response = JSON.parse(jsonResponse);
            if (response.status != 'ok') return;
            this.vehicleList = response.objects;
            this.vehicleList = this.vehicleList.filter(it => it.isActive == true);
            if (this.filter) {
              this.vehicleList = this.vehicleList.filter(
                it => it.isActive == true && it.company == this.filter
              );
            }

            for (var i = 0; i < this.vehicleList.length; i++) {
              var comp = this.companyList.find(it => it._id == this.vehicleList[i].company);
              this.vehicleList[i].companyName = !comp?"":comp.fullName;
              this.vehicleList[i].description = (!this.vehicleList[i].brand?"-": this.vehicleList[i].brand) + ' '
                                              + (!this.vehicleList[i].model?"-": this.vehicleList[i].model) + ' '
                                              + (!this.vehicleList[i].year?"-": this.vehicleList[i].year);

              var per = this.personList.find(it => it._id == this.vehicleList[i].owner);

              this.vehicleList[i].ownerName = !per?"":(per.names + " " + (!per.lastNames?"":per.lastNames) );
            }
        }
      },
      err => {
        if(err.substring(0,3)!= '404'){
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

  edit(selected){
    this.selected = selected;
    this.opened = true;
    this.currentState = 'EDIT';
  }

  delete(selected){
    this.selected = selected;

    this.vehicleService.deactivateData(selected._id).
    toPromise()
    .then( deleted => {
      if(deleted){
        this.toaster.success("Operación exitosa!");
        this.getList();
      }
      else
        {
          this.toaster.error("Operación fallida!");
          return;
        }
    }).
    catch(err => {
      this.toaster.error(err);
      return;
    })


  }

  changeState(state: string){
    this.currentState = state;
    if(state=='RETRIEVE')
      this.getList();
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

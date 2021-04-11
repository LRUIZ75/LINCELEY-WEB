import { Component, OnInit, Input } from '@angular/core';
import { CdkDragStart } from '@angular/cdk/drag-drop';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { MtxGridColumn } from '@ng-matero/extensions';

//Import services
import { Company, CompaniesService, Employee, EmployeesService, Person,PeopleService, Driver,DriversService} from 'app/services';
import { compilePipeFromMetadata } from '@angular/compiler';

@Component({
  selector: 'app-fleet-drivers',
  templateUrl: './drivers.component.html',
  styleUrls: ['./drivers.component.scss'],
  providers: [CompaniesService, EmployeesService, PeopleService, DriversService]
})
export class FleetDriversComponent implements OnInit {
  columns: MtxGridColumn[] = [
    {
      header: this.translate.stream('Id'),
      field: '_id',
      hide: true,
      sortable: true,
    },
    {
      header: this.translate.stream('domain.personName'),
      field: 'personName',
      sortable: true,
      disabled: true,
    },
    { header: this.translate.stream('domain.companyName'), field: 'companyName', sortable:true },
    { header: this.translate.stream('domain.isActive'), field: 'isActive', sortable:true, type: 'boolean' },
    { header: this.translate.stream('domain.isExternal'), field: 'isExternal' },
    { header: this.translate.stream('domain.isAvailable'), field: 'isAvailable' },
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
  public selected:  Driver;

  public driverList: any[]=[];
  public companyList: any[] = [];
  public employeeList: any[]=[];
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
  getEmployeeList() {
    this.employeeService
      .getData()
      .toPromise()
      .then(resp => {
        this.employeeList = resp.objects;
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
    public employeeService: EmployeesService,
    public personService: PeopleService,
    public driverService: DriversService,
    public translate: TranslateService,
    public toaster: ToastrService
  ) {
    this.title = this.translate.instant('domain.drivers');
    this.getCompanyList();
    this.getEmployeeList();
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
    this.driverService.getData().subscribe(
      res => {
        if (res) {
            var jsonResponse = JSON.stringify(res);
            var response = JSON.parse(jsonResponse);
            if (response.status != 'ok') return;
            this.driverList = response.objects;
            this.driverList = this.driverList.filter(it => it.isActive == true);
            if (this.filter) {
              this.driverList = this.driverList.filter(
                it => it.isActive == true && it.company == this.filter
              );
            }

            for (var i = 0; i < this.driverList.length; i++) {
              var comp = this.companyList.find(it => it._id == this.driverList[i].company);
              //var emp = this.employeeList.find(it => it._id == this.driverList[i].employee);
              var per = this.personList.find(it => it._id == this.driverList[i].person);
              this.driverList[i].companyName = !comp?"":comp.fullName;
              this.driverList[i].personName = !per?"":(per.names + " " + (!per.lastNames?"":per.lastNames) );
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

    this.driverService.deactivateData(selected._id).
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


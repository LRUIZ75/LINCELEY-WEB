import { Component, Input, OnInit } from '@angular/core';
import { CdkDragStart } from '@angular/cdk/drag-drop';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { MtxGridColumn } from '@ng-matero/extensions';
import { MtxLoaderModule } from '@ng-matero/extensions/loader';

//Import services
import {
  CompaniesService,
  Department,
  DepartmentsService,
  JobPositionsService,
  UsersService,
  Employee,
  EmployeesService
} from 'app/services';

@Component({
  selector: 'app-org-employees',
  templateUrl: './employees.component.html',
  styleUrls: ['./employees.component.scss'],
  providers: [
    JobPositionsService, 
    CompaniesService,
    DepartmentsService, 
    EmployeesService,
    UsersService
  ],

})
export class OrgEmployeesComponent implements OnInit {

  columns: MtxGridColumn[] = [
    {
      header: this.translate.stream('Id'),
      field: '_id',
      hide: true,
      sortable: true,
    },
    {
      header: this.translate.stream('domain.employeeid'),
      field: 'employeeId',
      sortable: true,
      disabled: true,
    },
    { header: this.translate.stream('domain.department'), field: 'department', hide: true },
    { header: this.translate.stream('domain.department'), field: 'departmentName', sortable: true },
    { header: this.translate.stream('domain.jobposition'), field: 'jobposition', hide: true },
    { header: this.translate.stream('domain.jobposition'), field: 'jobPositionName', sortable: true },
    { header: this.translate.stream('domain.user'), field: 'user', hide: true },
    { header: this.translate.stream('domain.user'), field: 'userName', sortable: true },
    { header: this.translate.stream('domain.isActive'), field: 'isActive', sortable: true },
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
  public selected: Department;

  public employeeList: any[] = [];
  public userList: any[] = [];
  public departmentList: any[] = [];
  public jobpositionList: any[] = [];
  public companyList: any[] = [];

  public title: string;
  public filterCompany: any;
  public filterDepartment: any;


  dragging = false;
  opened = false;

  @Input() filter: string = '';
  constructor(
    public employeeService: EmployeesService,
    public companyService: CompaniesService,
    public departmentService: DepartmentsService,
    public jobpositionService: JobPositionsService,
    public userService: UsersService,
    public translate: TranslateService,
    public toaster: ToastrService
  ) {
    this.title = this.translate.instant('domain.departments');
    this.getUserList();
    this.getDepartmentList();
    this.getJobpositionList();
    this.getCompanyList();

    this.getList();
  }

  ngOnInit() {
    this.currentState = 'RETRIEVE';
  }

  getUserList() {
    this.userService
      .getData()
      .toPromise()
      .then(resp => {
        this.userList = resp.objects;
      });
  }

  getCompanyList() {
    this.companyService
    .getData()
    .toPromise()
    .then(resp => {
      this.companyList = resp.objects;
    });
  }

  getDepartmentList() {
    this.departmentService
    .getData()
    .toPromise()
    .then(resp => {
      this.departmentList = resp.objects;
    });
  }

  getJobpositionList() {
    this.jobpositionService
    .getData()
    .toPromise()
    .then(resp => {
      this.jobpositionList = resp.objects;
    });
  }

  getList() {
    this.employeeService.getData().subscribe(
      res => {
        if (res) {
          var jsonResponse = JSON.stringify(res);
          var response = JSON.parse(jsonResponse);
          if (response.status != 'ok') return;
          this.employeeList = response.objects;
          this.employeeList = this.employeeList.filter(it => it.isActive == true);
          if (this.filter) {
            this.employeeList = this.employeeList.filter(
              it => it.isActive == true && it.company == this.filter
            );
          }

          for (var i = 0; i < this.employeeList.length; i++) {


            //departments's names
            var dept = this.departmentList.find(it => it._id == this.employeeList[i].department);
            this.employeeList[i].departmentName = dept.name;
            //user's names
            var users = this.userList.find(it => it._id == this.employeeList[i].user);
            this.employeeList[i].userName = users.name;
            //job's positions names
            var jp = this.jobpositionList.find(it => it._id == this.employeeList[i].jobposition);
            this.employeeList[i].jobPositionName = jp.name;
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

    this.jobpositionService
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

  resetFilters() {
    this.filterDepartment = "";
    this.filterCompany="";
  }
}

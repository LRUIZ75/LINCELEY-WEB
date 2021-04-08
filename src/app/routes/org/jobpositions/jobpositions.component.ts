import { Component, Input, OnInit } from '@angular/core';
import { CdkDragStart } from '@angular/cdk/drag-drop';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { MtxGridColumn } from '@ng-matero/extensions';
import { MtxLoaderModule } from '@ng-matero/extensions/loader';

//Import services
import {
  JobPositionsService,
  CompaniesService,
  Department,
  DepartmentsService,
  RolesService
} from 'app/services';

@Component({
  selector: 'app-org-jobpositions',
  templateUrl: './jobpositions.component.html',
  styleUrls: ['./jobpositions.component.scss'],
  providers: [JobPositionsService, DepartmentsService, CompaniesService, RolesService],
})
export class OrgJobpositionsComponent implements OnInit {

  columns: MtxGridColumn[] = [
    {
      header: this.translate.stream('Id'),
      field: '_id',
      hide: true,
      sortable: true,
    },
    {
      header: this.translate.stream('domain.name'),
      field: 'name',
      sortable: true,
      disabled: true,
    },
    { header: this.translate.stream('domain.company'), field: 'company', hide: true },
    { header: this.translate.stream('domain.company'), field: 'companyName', sortable: true },
    { header: this.translate.stream('domain.defaultrole'), field: 'defaultRole', hide: true },
    { header: this.translate.stream('domain.defaultrole'), field: 'roleName', sortable: true },
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

  public jobpositionList: any[] = [];
  public companyList: any[] = [];
  public departmentList: any[] = [];
  public roleList: any[] = [];

  public title: string;
  public filterCompany: any;
  public filterDepartment: any;


  dragging = false;
  opened = false;

  @Input() filter: string = '';
  constructor(
    public companyService: CompaniesService,
    public departmentService: DepartmentsService,
    public jobpositionService: JobPositionsService,
    public roleService: RolesService,
    public translate: TranslateService,
    public toaster: ToastrService
  ) {
    this.title = this.translate.instant('domain.departments');
    this.getCompanyList();
    this.getDepartmentList();
    this.getRoleList();

    this.getList();
  }

  ngOnInit() {
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

  getDepartmentList() {
    this.departmentService
    .getData()
    .toPromise()
    .then(resp => {
      this.departmentList = resp.objects;
    });
  }

  getRoleList() {
    this.roleService
    .getData()
    .toPromise()
    .then(resp => {
      this.roleList = resp.objects;
    });
  }

  getList() {
    this.jobpositionService.getData().subscribe(
      res => {
        if (res) {
          var jsonResponse = JSON.stringify(res);
          var response = JSON.parse(jsonResponse);
          if (response.status != 'ok') return;
          this.jobpositionList = response.objects;
          this.jobpositionList = this.jobpositionList.filter(it => it.isActive == true);
          if (this.filter) {
            this.jobpositionList = this.jobpositionList.filter(
              it => it.isActive == true && it.company == this.filter
            );
          }

          for (var i = 0; i < this.jobpositionList.length; i++) {
            var comp = this.companyList.find(it => it._id == this.jobpositionList[i].company);
            this.jobpositionList[i].companyName = comp.fullName;

            var role = this.roleList.find(it => it._id == this.jobpositionList[i].defaultRole);
            this.jobpositionList[i].roleName = role.name;
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

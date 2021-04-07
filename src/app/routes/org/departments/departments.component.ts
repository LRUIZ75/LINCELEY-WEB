import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CdkDragStart } from '@angular/cdk/drag-drop';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { MtxGridColumn } from '@ng-matero/extensions';

//Import services
import { Company, CompaniesService } from 'app/services';
import { Department, DepartmentsService } from 'app/services'

@Component({
  selector: 'app-org-departments',
  templateUrl: './departments.component.html',
  styleUrls: ['./departments.component.scss'],
  providers: [DepartmentsService, CompaniesService]
})



export class OrgDepartmentsComponent implements OnInit {

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
    { header: this.translate.stream('domain.company'), field: 'company' },
    { header: this.translate.stream('domain.isActive'), field: 'isActive' },
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
  showToolbar = true;
  columnHideable = true;
  columnMovable = true;
  rowHover = true;
  rowStriped = true;
  showPaginator = true;
  expandable = false;

  /* Variables locales */

  public currentState: string = 'RETRIEVE';
  public selected:  Company;


  public departmentList: Department[] = [];
  public title: string;
  dragging = false;
  opened = false;


  @Input() filter: string ='';
  constructor(
    public companyService: CompaniesService,
    public departmentService:DepartmentsService,
    public translate: TranslateService,
    public toaster: ToastrService
  ) {
    this.title = this.translate.instant('domain.departments');
    this.getList();
  }

  ngOnInit() {
    this.currentState = 'RETRIEVE';
  }

  getList() {
    this.departmentService.getData().subscribe(
      res => {
        if (res) {
            var jsonResponse = JSON.stringify(res);
            var response = JSON.parse(jsonResponse);
            if (response.status != 'ok') return;
            this.departmentList = response.objects as Department[];
            this.departmentList = this.departmentList.filter(it => it.isActive == true);
            if(this.filter) {
              this.departmentList = this.departmentList.filter(it => it.isActive == true && it.company == this.filter);
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

    this.departmentService.deactivateData(selected._id).
    toPromise()
    .then( deleted => {
      if(deleted){
        this.toaster.success("Operación exitosa!");
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

    this.getList();
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

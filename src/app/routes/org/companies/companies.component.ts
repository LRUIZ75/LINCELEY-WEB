import { Component, OnInit } from '@angular/core';
import { CdkDragStart } from '@angular/cdk/drag-drop';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { MtxGridColumn } from '@ng-matero/extensions';

//Import services
import { Company, CompaniesService } from 'app/services';

@Component({
  selector: 'app-org-companies',
  templateUrl: './companies.component.html',
  styleUrls: ['./companies.component.scss'],
  providers: [CompaniesService],
})
export class OrgCompaniesComponent implements OnInit {
  columns: MtxGridColumn[] = [
    {
      header: this.translate.stream('Id'),
      field: '_id',
      hide: true,
      sortable: true,
    },
    {
      header: this.translate.stream('domain.fullName'),
      field: 'fullName',
      sortable: true,
      disabled: true,
    },
    { header: this.translate.stream('domain.shortName'), field: 'shortName' },
    { header: this.translate.stream('domain.isActive'), field: 'isActive' },
    { header: this.translate.stream('domain.location-lat'), field: 'location.lat' },
    { header: this.translate.stream('domain.location-lng'), field: 'location.lng' },
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
          //click: record => this.edit(record),
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
          //click: record => this.delete(record),
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
  public selected: string;
  public selectedCompany: Company;
  public companyList: Company[] = [];
  public title: string;
  dragging = false;
  opened = false;

  constructor(
    public companyService: CompaniesService,
    public translate: TranslateService,
    public toaster: ToastrService
  ) {
    this.title = this.translate.instant('domain.companies');
    this.getList();
  }

  ngOnInit() {
    this.currentState = 'RETRIEVE';
  }

  getList() {
    this.companyService.getData().subscribe(
      res => {
        if (res) {
            var jsonResponse = JSON.stringify(res);
            var response = JSON.parse(jsonResponse);
            if (response.status != 'ok') return;
            this.companyList = response.objects as Company[];
            //this.userList = this.userList.filter(it => it.isActive == true);
        }
      },
      err => {
        if(err!= 404){
        var msg = this.translate.instant('record_actions.error_occurred');
        this.toaster.error(err, msg);
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
    this.opened = true;
    this.currentState = 'ADD';
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

import { Component, OnInit } from '@angular/core';
import { CdkDragStart } from '@angular/cdk/drag-drop';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { MtxGridColumn } from '@ng-matero/extensions';
import { MatSnackBar } from '@angular/material/snack-bar';


//Import services
import { Company, CompaniesService } from 'app/services';
import { DataTableDataBindCallback, DataTableTranslations } from 'ornamentum';

@Component({
  selector: 'app-org-companies',
  templateUrl: './companies.component.html',
  styleUrls: ['./companies.component.scss'],
  providers: [CompaniesService],
})
export class OrgCompaniesComponent implements OnInit {
/*   columns: MtxGridColumn[] = [
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
    { header: this.translate.stream('domain.shortName'), field: 'shortName', sortable:true },
    { header: this.translate.stream('domain.isActive'), field: 'isActive', sortable:true, type: 'boolean' },
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
 */
 


/*   isLoading = true;

  multiSelectable = false;
  rowSelectable = true;
  hideRowSelectionCheckbox = false;
  showToolbar = false;
  columnHideable = true;
  columnMovable = true;
  rowHover = true;
  rowStriped = true;
  showPaginator = true;
  expandable = false; */

  /* Variables locales */

  public currentState: string = 'RETRIEVE';
  public selected:  Company;

  public companyList: Company[] = [];
  public title: string;
  dragging = false;
  opened = false;

  public DataTableTranslations: DataTableTranslations = {
    pagination: {
      limit: this.translate.instant('pagination.limit'),
      rangeKey: this.translate.instant('pagination.records'),
      rangeSeparator: this.translate.instant('pagination.of'),
      nextTooltip: this.translate.instant('pagination.next'),
      previousTooltip: this.translate.instant('pagination.previous'),
      lastTooltip: this.translate.instant('pagination.last'),
      firstTooltip: this.translate.instant('pagination.first')
    }
  };


  constructor(
    public snackBar: MatSnackBar,
    public companyService: CompaniesService,
    public translate: TranslateService,
    public toaster: ToastrService
  ) {
    this.title = this.translate.instant('domain.companies');
    this.getList();
  }

  ngOnInit() {
    
    if('geolocation' in navigator) {
      console.log('geolocation is available');
    } else {
      console.log('geolocation is NOT available');
    }
    
    this.DataTableTranslations = {
      pagination: {
        limit: this.translate.instant('pagination.limit'),
        rangeKey: this.translate.instant('pagination.records'),
        rangeSeparator: this.translate.instant('pagination.of'),
        nextTooltip: this.translate.instant('pagination.next'),
        previousTooltip: this.translate.instant('pagination.previous'),
        lastTooltip: this.translate.instant('pagination.last'),
        firstTooltip: this.translate.instant('pagination.first')
      }
    };


  }

  getList() {
/*     this.isLoading=true; */
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

    if(!confirm("Esta seguro de eliminar el registro?")){
      return;
    }

    this.companyService.deactivateData(selected._id).
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

/*   enableRowExpandable() {
    this.columns[0].showExpand = this.expandable;
  } */
}

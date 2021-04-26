import { Component, OnInit } from '@angular/core';
import { CdkDragStart } from '@angular/cdk/drag-drop';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { MtxDialog } from '@ng-matero/extensions/dialog';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '@shared/components/confirm-dialog/confirm-dialog.component';
import { MatCheckboxChange } from '@angular/material/checkbox';

import { MtxGridColumn } from '@ng-matero/extensions';

//Import services
import { PeopleService, Person } from 'app/services';
import { DataTableTranslations } from 'ornamentum';

@Component({
  selector: 'app-security-people',
  templateUrl: './people.component.html',
  styleUrls: ['./people.component.scss'],
  providers: [PeopleService],
})
export class SecurityPeopleComponent implements OnInit {
  columns: MtxGridColumn[] = [
    {
      header: this.translate.stream('Id'),
      field: '_id',
      hide: true,
      sortable: true,
    },
    {
      header: this.translate.stream('domain.names'),
      field: 'names',
      sortable: true,
    },
    {
      header: this.translate.stream('domain.lastnames'),
      field: 'lastNames',
      sortable: true,
    },
    {
      header: this.translate.stream('domain.citizenid'),
      field: 'citizenId',
      sortable: true,
    },
    { header: this.translate.stream('domain.phone'), field: 'phone', sortable: true },
    { header: this.translate.stream('domain.mobile'), field: 'mobile', sortable: true },
    {
      header: this.translate.stream('domain.isuser'),
      field: 'isUser',
      sortable: true,
      type: 'boolean',
    },
    {
      header: this.translate.stream('domain.isemployee'),
      field: 'isEmployee',
      sortable: true,
      type: 'boolean',
    },
    {
      header: this.translate.stream('domain.isclient'),
      field: 'isClient',
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
  public selected: Person;

  public peopleList: any[] = [];
  public title: string;
  dragging = false;
  opened = false;

  public dataTableTranslations: DataTableTranslations;

  constructor(
    public peopleService: PeopleService,
    public translate: TranslateService,
    public toaster: ToastrService,
    public dialog: MtxDialog,
    private confirmDialog: MatDialog
  ) {
    this.title = this.translate.instant('domain.people');
    this.getList();
  }

  getTitle()
  {
    this.title = this.translate.instant('domain.companies');
    return this.title;
  }

  ngOnInit() {
    if ('geolocation' in navigator) {
      console.log('geolocation is available');
    } else {
      console.log('geolocation is NOT available');
    }
  }

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

  getList() {

    this.peopleService.getData().subscribe(
      res => {
        if (res) {
          var jsonResponse = JSON.stringify(res);
          var response = JSON.parse(jsonResponse);
          if (response.status != 'ok') return;
          this.peopleList = response.objects;
        }
      },
      err => {
        if (err.substring(0, 3) != '404') {
          var msg = this.translate.instant('record_actions.error_occurred');
          this.toaster.error(err);
        }
      }
    );
    this.isLoading=true;
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

  confirmDelete(selected) {
    const confirmDialog = this.confirmDialog.open(ConfirmDialogComponent, {
      data: {
        title: this.translate.instant('record_actions.deactivate'),
        message: this.translate.instant('notifications.can_deactivate') + ': ' + selected.names + ' ' +  selected.lastNames  + ' ?',
        button1Text: this.translate.instant('buttons.yes').toUpperCase(),
        button2Text: this.translate.instant('buttons.no').toUpperCase(),
      },
    });

    confirmDialog.afterClosed().subscribe(result => {
      if (result == true) this.delete(selected);
    });
  }

  disableDelete(record): boolean
    {return record.isEmployee || record.isUser || record.isClient;}

  delete(selected) {
    this.selected = selected;
    if(this.selected.isClient || this.selected.isEmployee || this.selected.isUser) {
      this.toaster.warning("Operación no permitida. El objeto tiene relaciones!");
      return;
    }
    this.peopleService
      .deleteData(selected._id)
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

  changeSelected(event:MatCheckboxChange,per:any) {
    if (event.checked)
       this.selected = <Person>per[0];
    else
       this.selected=null;
  }

  changeSelect (e: any){
    this.selected=<Person>e[0];
  }

  changeSort(e: any) {
    console.log(e);
  }

}

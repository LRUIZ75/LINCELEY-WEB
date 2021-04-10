import { Component, OnInit } from '@angular/core';
import { CdkDragStart } from '@angular/cdk/drag-drop';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { MtxGridColumn } from '@ng-matero/extensions';

//Import services
import { Company, CompaniesService, PeopleService, Person } from 'app/services';

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

  constructor(
    public peopleService: PeopleService,
    public translate: TranslateService,
    public toaster: ToastrService
  ) {
    this.title = this.translate.instant('domain.people');
    this.getList();
  }

  ngOnInit() {
    if ('geolocation' in navigator) {
      console.log('geolocation is available');
    } else {
      console.log('geolocation is NOT available');
    }
  }

  getList() {
    this.isLoading = true;
    this.peopleService.getData().subscribe(
      res => {
        if (res) {
          var jsonResponse = JSON.stringify(res);
          var response = JSON.parse(jsonResponse);
          if (response.status != 'ok') return;
          this.peopleList = response.objects;
          //this.userList = this.userList.filter(it => it.isActive == true);
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

  changeSelect(e: any) {
    this.selected = <Person>e;
  }

  changeSort(e: any) {
    console.log(e);
  }

  enableRowExpandable() {
    this.columns[0].showExpand = this.expandable;
  }
}

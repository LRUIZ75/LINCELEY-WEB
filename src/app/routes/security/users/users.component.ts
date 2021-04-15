import { Component, OnInit } from '@angular/core';
import { CdkDragStart } from '@angular/cdk/drag-drop';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { MtxGridColumn } from '@ng-matero/extensions';

//Import services
import { User, UsersService, PeopleService } from 'app/services';

@Component({
  selector: 'app-security-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
  providers: [UsersService],
})
export class SecurityUsersComponent implements OnInit {
  columns: MtxGridColumn[] = [
    {
      header: this.translate.stream('Id'),
      field: '_id',
      hide: true,
      sortable: true,
    },
    {
      header: this.translate.stream('Nombre'),
      field: 'name',
      sortable: true,
      disabled: true,
    },
    { header: this.translate.stream('Email'), field: 'email' },
    { header: this.translate.stream('Verificado'), field: 'emailVerified' },
    { header: this.translate.stream('Activo?'), field: 'isActive' },
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
  public selectedUser: User;
  public userList: User[] = [];
  public title: string;
  dragging = false;
  opened = false;

  constructor(
    public userService: UsersService,
    public peopleService: PeopleService,
    public translate: TranslateService,
    public toaster: ToastrService
  ) {
    this.title = this.translate.instant('domain.users');
   // this.getList();
  }

  ngOnInit() {
    this.changeState('RETRIEVE');
  }

  getList() {
    this.isLoading = false;
    this.userService.getData().subscribe(
      res => {
        if (res) {
          var jsonResponse = JSON.stringify(res);
          var response = JSON.parse(jsonResponse);
          if (response.status != 'ok') return [];
          this.userList = response.objects as User[];
          //this.userList = this.userList.filter(it => it.isActive == true);
        }
      },
      err => {
        var msg = this.translate.instant('record_actions.error_occurred');
        this.toaster.error(err.statusText + ': ' + err.message, msg);
      }
    );
    this.isLoading = true;
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
    this.changeState('ADD');
  }

  changeState(state: string){
    if(state=='RETRIEVE')
      this.getList();
    this.currentState = state;
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

import { Component, Input, OnInit } from '@angular/core';
import { CdkDragStart } from '@angular/cdk/drag-drop';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { MtxDialog } from '@ng-matero/extensions/dialog';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '@shared/components/confirm-dialog/confirm-dialog.component';
import { DataTableTranslations } from 'ornamentum';

//Import services
import {

  Employee,
  EmployeesService
} from 'app/services';

@Component({
  selector: 'app-org-employees',
  templateUrl: './employees.component.html',
  styleUrls: ['./employees.component.scss'],
  providers: [ EmployeesService],

})
export class OrgEmployeesComponent implements OnInit {

  

  /* Variables locales */
  public dataTableTranslations: DataTableTranslations;

  public currentState: string = 'RETRIEVE';
  public selected: Employee;

  public employeeList: any[] = [];
  public peopleList: any[] = [];
  public departmentList: any[] = [];
  public jobpositionList: any[] = [];
  public companyList: any[] = [];

  public title: string;
  public filterCompany: any;
  public filterDepartment: any;


  dragging = false;
  opened = false;

  @Input() companyFilter: string = '';
  constructor(
    public employeeService: EmployeesService,
    public translate: TranslateService,
    public toaster: ToastrService,
    public dialog: MtxDialog,
    private confirmDialog: MatDialog
  ) {
    this.title = this.translate.instant('domain.departments');

    this.getList();
  }

  ngOnInit() {
    this.currentState = 'RETRIEVE';
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
        selectPlaceholder: this.translate.instant('record_actions.search'),
      },
      columnSelector: { header: '>>' },
    };
    return this.dataTableTranslations;
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
          if (this.companyFilter) {
            this.employeeList = this.employeeList.filter(
              it => it.isActive == true && it.company._id == this.companyFilter
            );
          }
          this.employeeList.forEach(e =>e.personName = e.person.names + " "  + e.person.lastNames);
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

    //depopulate

    this.selected.department = selected.department._id;
    this.selected.jobposition = selected.jobposition._id;
    this.selected.person = selected.person._id;

    this.opened = true;
    this.currentState = 'EDIT';
  }


  confirmDelete(selected) {
    //Ejemplo del confirm de MTX= > NO USAR ESTO!!!
    /*     this.dialog.confirm("Desactivar registro?",null,()=>
      this.delete(selected)
    ); */

    const confirmDialog = this.confirmDialog.open(ConfirmDialogComponent, {
      data: {
        title: this.translate.instant('record_actions.deactivate'),
        message:
          this.translate.instant('notifications.can_deactivate') + ': ' + selected.name + ' ?',
        button1Text: this.translate.instant('buttons.yes').toUpperCase(),
        button2Text: this.translate.instant('buttons.no').toUpperCase(),
      },
    });

    //Ejemplo de un confirmDialog sin data injection => Versión básica
    //const confirmDialog = this.confirmDialog.open(ConfirmDialogComponent);

    confirmDialog.afterClosed().subscribe(result => {
      if (result == true) this.delete(selected);
    });
  }

  delete(selected) {
    this.selected = selected;

    this.employeeService
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


}

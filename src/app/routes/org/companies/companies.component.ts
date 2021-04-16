import { Component, OnInit } from '@angular/core';
import { CdkDragStart } from '@angular/cdk/drag-drop';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { MtxDialog } from '@ng-matero/extensions/dialog';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '@shared/components/confirm-dialog/confirm-dialog.component';


//Import services
import { Company, CompaniesService } from 'app/services';
import { DataTableTranslations } from 'ornamentum';

@Component({
  selector: 'app-org-companies',
  templateUrl: './companies.component.html',
  styleUrls: ['./companies.component.scss'],
  providers: [CompaniesService],
})
export class OrgCompaniesComponent implements OnInit {
  /* Variables locales */

  public currentState: string = 'RETRIEVE';
  public selected: Company;

  public companyList: Company[] = [];
  public title: string;
  dragging = false;
  opened = false;

  public dataTableTranslations: DataTableTranslations;

  constructor(
    public companyService: CompaniesService,
    public translate: TranslateService,
    public toaster: ToastrService,
    public dialog: MtxDialog,
    private confirmDialog: MatDialog
  ) {
    this.title = this.translate.instant('domain.companies');
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

  confirmDelete(selected) {
    //Ejemplo del confirm de MTX= > NO USAR ESTO!!!
    /*     this.dialog.confirm("Desactivar registro?",null,()=>
      this.delete(selected)
    ); */

    const confirmDialog = this.confirmDialog.open(ConfirmDialogComponent, {
      data: {
        title: this.translate.instant('record_actions.deactivate'),
        message: this.translate.instant('notifications.can_deactivate') + ': ' + selected.fullName + ' ?',
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

    this.companyService
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

  /*   enableRowExpandable() {
    this.columns[0].showExpand = this.expandable;
  } */
}

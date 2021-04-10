import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  JobPosition,
  JobPositionsService,
  Company,
  CompaniesService,
  Department,
  DepartmentsService,
  Role,
  RolesService
} from 'app/services';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-addjobposition',
  templateUrl: './addjobposition.component.html',
  styleUrls: ['./addjobposition.component.scss'],
})
export class AddjobpositionComponent implements OnInit {
  /**
   * Formulario de Agregar/Editar
   */
  jobpositionFormGroup: FormGroup;
  jobposition: JobPosition;

  public companyList: any[] = [];
  public companies: any[] = [];

  public roles: any[] = [];
  public roleList: any[] = [];

  @Output() changeStateEvent = new EventEmitter<string>();

  @Input() formMode = 'ADD';
  @Input() initialData: any = {};

  constructor(
    private formBuilder: FormBuilder,
    private companyService: CompaniesService,
    private departmentService: DepartmentsService,
    private jobpositionService: JobPositionsService,
    private roleService: RolesService,
    private toaster: ToastrService
  ) {}

  ngOnInit(): void {
    this.jobpositionFormGroup = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(5)]],
      company: ['', [Validators.required]],
      defaultRole: ['', [Validators.required]],
      isActive: [true, [Validators.required]],
    });

    if (this.formMode == 'EDIT' && this.initialData) {
      this.jobpositionFormGroup.patchValue(this.initialData as JobPosition);
    }

    //build Company List for Selecte
    this.getCompanyList();

    //build Company List for Selecte
    this.getRoleList();
  }

  getCompanyList() {
    this.companyService
      .getData()
      .toPromise()
      .then(response => {
        if (!response) {
          this.toaster.error('No hay datos de compañías!');
          return;
        }
        this.companies = response.objects;
        switch (this.formMode) {
          case 'ADD':
            this.companyList = this.companies.filter(company => company.isActive == true);
            break;
          default:
            this.companyList = this.companies;
        }
      })
      .catch(err => {
        this.toaster.error(err.message);
      });
  }

  getRoleList() {
    this.roleService
      .getData()
      .toPromise()
      .then(response => {
        if (!response) {
          this.toaster.error('No hay datos de roles!');
          return;
        }
        this.roles = response.objects;
        switch (this.formMode) {
          case 'ADD':
            this.roleList = this.roles.filter(roles => roles.isActive == true);
            break;
          default:
            this.roleList = this.roles;
        }
      })
      .catch(err => {
        this.toaster.error(err.message);
      });
  }

  get name() {
    return this.jobpositionFormGroup.get('name');
  }

  get company() {
    return this.jobpositionFormGroup.get('company');
  }

  /**
   * Resetea el valor de todos los campos
   */
  onReset() {
    this.jobpositionFormGroup.reset();
  }

  /**
   * Cancela el modo de agregar/editar
   */
  onCancel() {
    this.changeState('RETRIEVE');
  }

  /**
   * Cambia el estado actual de acceso a datos
   * @param value Nuevo Estado
   */
  changeState(value: string) {
    this.changeStateEvent.emit(value);
  }

  onSubmit() {
    if (!this.jobpositionFormGroup.valid) {
      this.toaster.warning('El formulario tiene erorres!');
      return;
    }

    this.jobposition = <JobPosition>this.jobpositionFormGroup.value;

    switch (this.formMode) {
      case 'EDIT':
        this.jobpositionService
          .updateData(this.initialData._id, this.jobposition)
          .toPromise()
          .then(resp => {
            if (!resp) {
              this.toaster.error('Operación fallida!');
              return;
            }

            this.jobposition = <JobPosition>resp.updated;
            this.toaster.success('Operación exitosa!');
            this.changeState('RETRIEVE');
          })
          .catch(err => {
            this.toaster.error(err);
          });
        break;

      case 'ADD':
        this.jobpositionService
          .addData(this.jobposition)
          .toPromise()
          .then(resp => {
            if (!resp) {
              this.toaster.error('Operación fallida!');
              return;
            }

            this.jobposition = <JobPosition>resp.created;
            this.toaster.success('Operación exitosa!');
            this.changeState('RETRIEVE');
          })
          .catch(err => {
            this.toaster.error(err.message);
          });
        break;

      default:
        this.toaster.warning('Se desconoce el modo del formulario');
    }
  }
}

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
  RolesService,
  User,
  UsersService,
  Employee,
  EmployeesService,
  PeopleService,
} from 'app/services';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-addemployee',
  templateUrl: './addemployee.component.html',
  styleUrls: ['./addemployee.component.scss'],
})
export class AddemployeeComponent implements OnInit {
  /**
   * Formulario de Agregar/Editar
   */
  employeeFormGroup: FormGroup;
  employee: Employee;

  public companyList: any[] = [];
  public companies: any[] = [];
  public selectedCompany: any;


  public departmentList: any[] = [];
  public departments: any[] = [];
  public selectedDepartment: any;


  public jobpositionList: any[] = [];
  public jobpositions: any[] = [];
  public selectedJobPosition: any;

  public peopleList: any[] = [];
  public people: any[] = [];
  public selectedPerson: any;
 

  @Output() changeStateEvent = new EventEmitter<string>();

  @Input() formMode = 'ADD';
  @Input() initialData: any = {};

  constructor(
    private formBuilder: FormBuilder,
    private companyService: CompaniesService,
    private departmentService: DepartmentsService,
    private jobpositionService: JobPositionsService,
    private peopleService: PeopleService,
    private roleService: RolesService,
    private userService: UsersService,
    private employeeService: EmployeesService,
    private toaster: ToastrService
  ) {}

  ngOnInit(): void {
    this.employeeFormGroup = this.formBuilder.group({
      employeeId: [''],
/*       company: ['', [Validators.required]], */
      department: ['', [Validators.required]],
      jobposition: ['', [Validators.required]],
      person: ['', [Validators.required]],
      isActive: [true, [Validators.required]],
    });

    if (this.formMode == 'EDIT' && this.initialData) {
      var dataEditable = <Employee> this.initialData;
    
      this.employeeFormGroup.patchValue(dataEditable);
      //TODO: Actualizar también el valor actual de Company a partir de deparment
      this.selectedDepartment = dataEditable.department;
      this.selectedJobPosition = dataEditable.jobposition;
      this.selectedPerson = dataEditable.person;
      

    }

    //build Company List for Selecte
    this.getCompanyList();
    //build Department List for Select
    this.getDepartmentList();

    //build Job Positions List for Selecte
    this.getJobPositionList();

    this.getPeopleList();
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
            this.companyList = this.companies.filter(company => company.isActive == true);
        }
      })
      .catch(err => {
        this.toaster.error(err.message);
      });
  }

  getDepartmentList(filterById: string = '') {
    this.departmentService
      .getData()
      .toPromise()
      .then(response => {
        if (!response) {
          this.toaster.error('No hay datos de departamentos!');
          return;
        }
        this.departments = response.objects;
        switch (this.formMode) {
          case 'ADD':
            this.departmentList = this.departments.filter(dep => dep.isActive == true);

            break;
          default:
            this.departmentList = this.departments;
        }
        if (filterById) this.departmentList = this.departmentList.filter(dep => dep.company == filterById);
      })
      .catch(err => {
        this.toaster.error(err.message);
      });
  }


  getJobPositionList(filterById: string = '') {
    this.jobpositionService
      .getData()
      .toPromise()
      .then(response => {
        if (!response) {
          this.toaster.error('No hay datos de puestos!');
          return;
        }
        this.jobpositions = response.objects;
        switch (this.formMode) {
          case 'ADD':
            this.jobpositionList = this.jobpositions.filter(jp => jp.isActive == true);
            break;
          default:
            this.jobpositionList = this.jobpositions;
        }
        if (filterById) this.jobpositionList = this.jobpositionList.filter(jp => jp.company == filterById);
      })
      .catch(err => {
        this.toaster.error(err.message);
      });
  }


  getPeopleList(filterById: string = '') {
    this.peopleService
      .getData()
      .toPromise()
      .then(response => {
        if (!response) {
          this.toaster.error('No hay datos de personas!');
          return;
        }
        this.people = response.objects;
        switch (this.formMode) {
          case 'ADD':
            this.peopleList = this.people.filter(person => (!person.isEmployee));
            break;
          default:
            this.peopleList = this.people;
        }
        //if (filterById) this.peopleList = this.peopleList.filter(person => person.company == filterById);
      })
      .catch(err => {
        this.toaster.error(err.message);
      });
  }


  get company() {
    return this.employeeFormGroup.get('company');
  }

  /**
   * Resetea el valor de todos los campos
   */
  onReset() {
    this.employeeFormGroup.reset();
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
    if (!this.employeeFormGroup.valid) {
      this.toaster.warning('El formulario tiene erorres!');
      return;
    }
    
    if(!this.selectedCompany && this.formMode=='ADD'){
      this.toaster.warning('El formulario puede tener erorres: filtre primero por compañía!');
      return;
    }

    this.employee = <Employee>this.employeeFormGroup.value;

    switch (this.formMode) {
      case 'EDIT':
        this.employeeService
          .updateData(this.initialData._id, this.employee)
          .toPromise()
          .then(resp => {
            if (!resp) {
              this.toaster.error('Operación fallida!');
              return;
            }

            this.employee = <Employee>resp.updated;
            this.toaster.success('Operación exitosa!');
            this.changeState('RETRIEVE');
          })
          .catch(err => {
            this.toaster.error(err);
          });
        break;

      case 'ADD':
        this.employeeService
          .addData(this.employee)
          .toPromise()
          .then(resp => {
            if (!resp) {
              this.toaster.error('Operación fallida!');
              return;
            }

            this.employee = <Employee>resp.created;
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

  onSelectCompany(selectedCompany) {
    if(!selectedCompany || !selectedCompany.value){
      this.selectedCompany = undefined;
      return; 
    }
      

    this.selectedCompany = selectedCompany.value;

    this.selectedDepartment='';
    this.getDepartmentList(selectedCompany.value);


    this.selectedJobPosition='';
    this.getJobPositionList(selectedCompany.value);

    this.selectedPerson = '';
    this.getPeopleList();
  }
}

import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Company, CompaniesService, Department, DepartmentsService } from 'app/services';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-adddepartment',
  templateUrl: './adddepartment.component.html',
  styleUrls: ['./adddepartment.component.scss']
})
export class AdddepartmentComponent implements OnInit {

    /**
   * Formulario de Agregar/Editar
   */
     departmentFormGroup: FormGroup;
     department: Department;

     @Output() changeStateEvent = new EventEmitter<string>();

     @Input() formMode = 'ADD';
     @Input() initialData: any = {};
   
     constructor(
       private formBuilder: FormBuilder,
       private companyService: CompaniesService,
       private departmentService: DepartmentsService,
       private toaster: ToastrService
     ) {}
   
     ngOnInit(): void {
       this.departmentFormGroup = this.formBuilder.group({
         name: ['', [Validators.required, Validators.minLength(5)]],
         company: ['', [Validators.required]],
         isActive: [true, [Validators.required]]
       });
   
       if (this.formMode == 'EDIT' && this.initialData) {
         this.departmentFormGroup.patchValue(this.initialData as Department);
       }
     }
   
     get name() {
       return this.departmentFormGroup.get('name');
     }
   
     get company() {
       return this.departmentFormGroup.get('company');
     }
   
     /**
      * Resetea el valor de todos los campos
      */
     onReset() {
       this.departmentFormGroup.reset();
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
       if (!this.departmentFormGroup.valid) {
         this.toaster.warning('El formulario tiene erorres!');
         return;
       }
   
       this.department = <Department>this.departmentFormGroup.value;
   
       switch(this.formMode){
         case 'EDIT':
           this.departmentService
           .updateData(this.initialData._id,this.department)
           .toPromise()
           .then(resp => {
             if (!resp) {
               this.toaster.error('Operación fallida!');
               return;
             }
     
             this.department = <Department>resp.updated;
             this.toaster.success('Operación exitosa!');
             this.changeState('RETRIEVE');
           })
           .catch(err => {
             this.toaster.error(err);
           });
           break;
   
         case 'ADD':
           this.departmentService
           .addData(this.department)
           .toPromise()
           .then(resp => {
             if (!resp) {
               this.toaster.error('Operación fallida!');
               return;
             }
     
             this.department = <Department>resp.created;
             this.toaster.success('Operación exitosa!');
             this.changeState('RETRIEVE');
           })
           .catch(err => {
             this.toaster.error(err);
           });
           break;
   
         default:
           this.toaster.warning("Se desconoce el modo del formulario");
   
   
       }
   
     }
   }
   
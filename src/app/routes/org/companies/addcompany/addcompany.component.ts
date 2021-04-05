import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validator, Validators } from '@angular/forms';
import { MtxFormGroupModule } from '@ng-matero/extensions';
import { Company, CompaniesService } from 'app/services';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-addcompany',
  templateUrl: './addcompany.component.html',
  styleUrls: ['./addcompany.component.scss']
})
export class AddcompanyComponent implements OnInit {
    /**
     * Formulario de Agregar/Editar
     */
    companyFormGroup: FormGroup;
    company: Company;

    @Output() changeStateEvent = new EventEmitter<string>();

  constructor(
    private formBuilder: FormBuilder,
    private companyService: CompaniesService,
    private toaster: ToastrService
  ) { }

  ngOnInit(): void {

    this.companyFormGroup = this.formBuilder.group({
      fullName: ['',Validators.required],
      shortName: ['',Validators.required],
      isActive: [true,Validators.required],
      location: this.formBuilder.group({
        lat: ['',Validators.required],
        lng: ['',Validators.required]
      })
    });
  }

  /**
   * Resetea el valor de todos los campos
   */
  onReset() {
    this.companyFormGroup.reset();
    
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
    
    if(!this.companyFormGroup.valid){
      this.toaster.warning("El formulario tiene erorres!");
      return;
    }

    

    this.changeState('RETRIEVE');
  }

}

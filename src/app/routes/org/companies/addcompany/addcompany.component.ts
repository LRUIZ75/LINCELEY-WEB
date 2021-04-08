import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Company, CompaniesService } from 'app/services';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-addcompany',
  templateUrl: './addcompany.component.html',
  styleUrls: ['./addcompany.component.scss'],
})
export class AddcompanyComponent implements OnInit {
  /**
   * Formulario de Agregar/Editar
   */
  companyFormGroup: FormGroup;
  company: Company;

  public latitude: any;
  public longitude: any;

  @Output() changeStateEvent = new EventEmitter<string>();

  @Input() formMode = 'ADD';
  @Input() initialData: any = {};

  constructor(
    private formBuilder: FormBuilder,
    private companyService: CompaniesService,
    private toaster: ToastrService
  ) {}

  ngOnInit(): void {
    this.companyFormGroup = this.formBuilder.group({
      fullName: ['', [Validators.required, Validators.minLength(2)]],
      shortName: ['', [Validators.required]],
      isActive: [true, [Validators.required]],
      location: this.formBuilder.group({
        lat: [1, [Validators.required]],
        lng: [2, [Validators.required]],
      }),
    });

    if (this.formMode == 'EDIT' && this.initialData) {
      this.companyFormGroup.patchValue(this.initialData as Company);
    }

    if (this.formMode == 'ADD') {
      if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(position => {
          this.initialData = {
            fullName: '',
            shortName: '',
            isActive: true,
            location: {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            },
          };
          this.companyFormGroup.patchValue(this.initialData as Company);

          this.latitude = position.coords.latitude.toString();
          this.longitude = position.coords.longitude.toString();
          console.log(this.latitude, this.longitude);
        });
      }
    }
  }

  get fullName() {
    return this.companyFormGroup.get('fullName');
  }

  get shortName() {
    return this.companyFormGroup.get('shortName');
  }

  get lat() {
    return this.companyFormGroup.get('location').get('lat');
  }

  set lat(value) {
    this.companyFormGroup.get('location').get('lat').setValue(value);
  }

  get lng() {
    return this.companyFormGroup.get('location').get('lng');
  }

  set lng(value) {
    this.companyFormGroup.get('location').get('lng').setValue(value);
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
    if (!this.companyFormGroup.valid) {
      this.toaster.warning('El formulario tiene erorres!');
      return;
    }

    this.company = <Company>this.companyFormGroup.value;

    switch (this.formMode) {
      case 'EDIT':
        this.companyService
          .updateData(this.initialData._id, this.company)
          .toPromise()
          .then(resp => {
            if (!resp) {
              this.toaster.error('Operación fallida!');
              return;
            }

            this.company = <Company>resp.updated;
            this.toaster.success('Operación exitosa!');
            this.changeState('RETRIEVE');
          })
          .catch(err => {
            this.toaster.error(err);
          });
        break;

      case 'ADD':
        this.companyService
          .addData(this.company)
          .toPromise()
          .then(resp => {
            if (!resp) {
              this.toaster.error('Operación fallida!');
              return;
            }

            this.company = <Company>resp.created;
            this.toaster.success('Operación exitosa!');
            this.changeState('RETRIEVE');
          })
          .catch(err => {
            this.toaster.error(err);
          });
        break;

      default:
        this.toaster.warning('Se desconoce el modo del formulario');
    }
  }
}

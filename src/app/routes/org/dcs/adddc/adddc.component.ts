import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  Company,
  CompaniesService,
  DistributionCenter,
  DistributionCentersService,
} from 'app/services';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-adddc',
  templateUrl: './adddc.component.html',
  styleUrls: ['./adddc.component.scss'],
})
export class AdddcComponent implements OnInit {
  /**
   * Formulario de Agregar/Editar
   */
  dcFormGroup: FormGroup;
  distributioncenter: DistributionCenter;

  public companyList: any[] = [];

  public latitude: any;
  public longitude: any;

  @Output() changeStateEvent = new EventEmitter<string>();

  @Input() formMode = 'ADD';
  @Input() initialData: any = {};

  constructor(
    private formBuilder: FormBuilder,
    private distributionCenterService: DistributionCentersService,
    private companyService: CompaniesService,
    private toaster: ToastrService
  ) {
    this.getCompanyList();
  }

  ngOnInit(): void {
    this.dcFormGroup = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(5)]],
      company: ['', [Validators.required]],
      isActive: [true, [Validators.required]],
      location: this.formBuilder.group({
        lat: [1, [Validators.required]],
        lng: [2, [Validators.required]],
      }),
    });

    if (this.formMode == 'EDIT' && this.initialData) {
      this.dcFormGroup.patchValue(this.initialData as DistributionCenter);
    }

    if (this.formMode == 'ADD') {
      if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(position => {
          this.initialData = {
            name: '',
            company: '',
            isActive: true,
            location: {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            },
          };
          this.dcFormGroup.patchValue(this.initialData as DistributionCenter);

          this.latitude = position.coords.latitude.toString();
          this.longitude = position.coords.longitude.toString();
          console.log(this.latitude, this.longitude);
        });
      }
    }
  }

  getCompanyList() {
    this.companyService
      .getData()
      .toPromise()
      .then(resp => {
        this.companyList = resp.objects;
        if(this.formMode=="ADD")
          this.companyList = this.companyList.filter(company => company.isActive);
      });
  }

  get name() {
    return this.dcFormGroup.get('name');
  }

  get company() {
    return this.dcFormGroup.get('company');
  }

  get lat() {
    return this.dcFormGroup.get('location').get('lat');
  }

  set lat(value) {
    this.dcFormGroup.get('location').get('lat').setValue(value);
  }

  get lng() {
    return this.dcFormGroup.get('location').get('lng');
  }

  set lng(value) {
    this.dcFormGroup.get('location').get('lng').setValue(value);
  }

  /**
   * Resetea el valor de todos los campos
   */
  onReset() {
    this.dcFormGroup.reset();
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
    if (!this.dcFormGroup.valid) {
      this.toaster.warning('El formulario tiene erorres!');
      return;
    }

    this.distributioncenter = <DistributionCenter>this.dcFormGroup.value;

    switch (this.formMode) {
      case 'EDIT':
        this.companyService
          .updateData(this.initialData._id, this.distributioncenter)
          .toPromise()
          .then(resp => {
            if (!resp) {
              this.toaster.error('Operación fallida!');
              return;
            }

            this.distributioncenter = <DistributionCenter>resp.updated;
            this.toaster.success('Operación exitosa!');
            this.changeState('RETRIEVE');
          })
          .catch(err => {
            this.toaster.error(err);
          });
        break;

      case 'ADD':
        this.distributionCenterService
          .addData(this.distributioncenter)
          .toPromise()
          .then(resp => {
            if (!resp) {
              this.toaster.error('Operación fallida!');
              return;
            }

            this.distributioncenter = <DistributionCenter>resp.created;
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

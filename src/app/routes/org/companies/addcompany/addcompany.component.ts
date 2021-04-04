import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validator } from '@angular/forms';
import { MtxFormGroupModule } from '@ng-matero/extensions';

@Component({
  selector: 'app-addcompany',
  templateUrl: './addcompany.component.html',
  styleUrls: ['./addcompany.component.scss']
})
export class AddcompanyComponent implements OnInit {

    companyFormGroup: MtxFormGroupModule;

  constructor(
    private formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {

    this.companyFormGroup = this.formBuilder.group({
      fullName: [''],
      shortName: [''],
      isActive: [false],
      location: this.formBuilder.group({
        lat: [''],
        lng: ['']
      })
    });
  }

}

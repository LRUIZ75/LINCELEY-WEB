import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';



@Component({
  selector: 'app-security-users-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss']
})
export class SecurityUsersFormComponent implements OnInit {
  public data: any = {};
  
  @Input() selectedRow: any;
  @Input() formMode: string = '';

  roles : string[] = ["administrador"];

  public isActive=  false;

  public personFormGroup: FormGroup;
  public accountFormGroup: FormGroup;
  public 

  constructor(private formBuilder: FormBuilder) {
    this.personFormGroup = this.formBuilder.group({
      names: ['', Validators.required],
      lastNames: ['', Validators.required],
      personalId: ['',Validators.required],
      mobileNumber:  ['']
    });

    this.accountFormGroup = this.formBuilder.group({
      name: ['', Validators.required],
      email: ['', Validators.required],
      password: ['', Validators.required],
      //isActive: ['']
    });
   }

 

  ngOnInit() {

  }

  onSubmit() {

  }
}

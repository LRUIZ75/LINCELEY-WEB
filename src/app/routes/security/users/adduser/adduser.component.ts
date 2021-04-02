import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-security-users-adduser',
  templateUrl: './adduser.component.html',
  styleUrls: ['./adduser.component.scss'],
})
export class SecurityUsersAdduserComponent implements OnInit {

  public isActive = false;

  public personFormGroup: FormGroup = this.formBuilder.group({
    names: ['', Validators.required],
    lastNames: ['', Validators.required],
    personalId: ['', Validators.required],
    mobileNumber: ['']
  });
  public accountFormGroup: FormGroup = this.formBuilder.group({
    name: ['', Validators.required],
    email: ['', Validators.required],
    password: ['', Validators.required]
  });

  constructor(public formBuilder: FormBuilder) {
    

  }

  ngOnInit() {

  }

  onSubmit() {}
}

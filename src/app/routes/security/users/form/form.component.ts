import { validateAndRewriteCoreSymbol } from '@angular/compiler-cli/src/ngtsc/imports';
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from "@angular/forms";

@Component({
  selector: 'app-security-users-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss']
})
export class SecurityUsersFormComponent implements OnInit {
  public data: any = {};
  
  @Input() selectedRow: any;

  public title = 'User Form';
  public userForm: any;

  constructor(private fb: FormBuilder) {

    this.userForm = this.fb.group({
      name: ['', Validators.required, Validators.minLength(5) ],
      email: ['', Validators.required, Validators.email],
      password: [''],
      isActive: [true],
      person: this.fb.group ({
        names: ['', Validators.required],
        lastNames: ['', Validators.required],
        personalId: ['',Validators.required],
        mobileNumber:  ['', Validators.required]
      })
    });

   }

   get name(){
     return this.userForm.get('name');
   }

    get email() {
      return this.userForm.get('email');
    }

  ngOnInit() {
  }

  onSubmit() {

  }
}

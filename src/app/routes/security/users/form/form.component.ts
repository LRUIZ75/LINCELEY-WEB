import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-security-users-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss']
})
export class SecurityUsersFormComponent implements OnInit {
  public data: any = {};
  
  @Input() selectedRow: any;
  constructor() { }

  ngOnInit() {
  }

}

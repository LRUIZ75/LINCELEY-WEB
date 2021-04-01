import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { setClassMetadata } from '@angular/core/src/r3_symbols';
import { FormControl, FormsModule } from '@angular/forms';
import { TooltipPosition } from '@ng-matero/extensions';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { convertToObject } from 'typescript';
import { UsersService } from '../users.service';
import { PeopleService } from '../../people/people.service';

@Component({
  selector: 'app-security-users-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
})
export class SecurityUsersListComponent implements OnInit {
  public data: any[] = [];
  public person: any = {};

  @Output() deleteEvent = new EventEmitter<string>();
  @Output() editEvent = new EventEmitter<string>();

  positionOptions: TooltipPosition[] = ['after', 'before', 'above', 'below', 'left', 'right'];
  position = new FormControl(this.positionOptions[2]);

  constructor(
    private userService: UsersService,
    private peopleService: PeopleService,
    private toaster: ToastrService,
    private translate: TranslateService
  ) {}

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.userService.getData().subscribe(
      res => {
        if (res) {
          var jsonResponse = JSON.stringify(res);
          var response = JSON.parse(jsonResponse);
          if (response.status != 'ok') return;
          this.data = response.objects;
          this.data = this.data.filter(it => it.isActive == true);
          if(this.data.length <=0)
            return;
          this.data.forEach(userData => {
            this.peopleService.getDataById(userData.person).subscribe(
              res => {
                var personData = JSON.parse(JSON.stringify(res));
                userData.person = personData.objects[0];
              },
              err => {
                var msg = this.translate.instant('record_actions.error_occurred');
                this.toaster.error(err.statusText + ': ' + err.message, msg);
              }
            );
          });
        }
      console.log(this.data);
      },
      err => {
        var msg = this.translate.instant('record_actions.error_occurred');
        this.toaster.error(err.statusText + ': ' + err.message, msg);
      }
    );
  }


  deleteRequest(id: string) {
    console.log("Solicitando borrar: " + id);
    this.deleteEvent.emit(id);
    
  }

  editRequest(id: string){
    console.log("Solicitando editar: " + id);
    this.editEvent.emit(id);
  }

}

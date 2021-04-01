import { Component,  Injectable,  OnInit} from '@angular/core';
import { DialogRole, MatDialog, MatDialogConfig } from '@angular/material/dialog';

export enum ComponentMode {
  ADD = 'ADD',
  EDIT = 'EDIT',
  RETRIEVE = 'RETRIEVE'
}

//Dialogo de Eliminación
@Component({
  selector:'delete-dialog',
  templateUrl: './dialog-delete.html'
})
export class DialogDeleteComponent {

  close() {
    this.close();
  }



}


@Component({
  selector: 'app-security-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
@Injectable()
export class SecurityUsersComponent implements OnInit {

  public currentState: ComponentMode = ComponentMode.RETRIEVE;
  public selected: any;
  public dialogResult: string;

  constructor(public deleteDialog: MatDialog) { }

  ngOnInit() {
    this.currentState = ComponentMode.RETRIEVE;

  }

  changeMode(mode: string){
    this.currentState = mode as ComponentMode;
    this.selected = '';
    
  }
  editMode(id: string){
    this.changeMode("EDIT");
    this.selected = id;
    console.log("Received: " +  id);

  }

  deleteMode(id: string){
/*     const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = false;
    dialogConfig.autoFocus = true;
    dialogConfig.closeOnNavigation = true;
    
    this.deleteDialog.open(DialogDeleteComponent,dialogConfig);
    if(this.dialogResult =="SI"){
      console.log("procedemos con el borrado!!!!");
    } */
  }
    
}

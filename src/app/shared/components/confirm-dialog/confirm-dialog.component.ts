import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
  styleUrls: ['./confirm-dialog.component.scss'],
})
export class ConfirmDialogComponent implements OnInit {
  title: string = 'Confirme';
  message: string;
  button1Text: string = 'Aceptar';
  button2Text: string = 'Cancelar';
  constructor(
    public dialogRef: MatDialogRef<ConfirmDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    if(this.data?.title) this.title = this.data.title;
    if(this.data?.message) this.message = this.data.message;
    if(this.data?.button1Text) this.button1Text = this.data.button1Text;
    if(this.data?.button2Text) this.button2Text = this.data.button2Text;

  }

  ngOnInit() {
    


  }
}

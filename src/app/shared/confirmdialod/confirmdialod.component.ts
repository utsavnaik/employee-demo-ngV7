import { Component, OnInit, Inject, AfterViewInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { timeout } from 'rxjs/operators';

@Component({
  selector: 'app-confirmdialod',
  templateUrl: './confirmdialod.component.html',
  styleUrls: ['./confirmdialod.component.css']
})
export class ConfirmdialodComponent implements OnInit {
  message: String;
  confirmButtonText: String;
  cancelButtonText: String;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
  public dialogRef: MatDialogRef<ConfirmdialodComponent>) {
      if(this.data){
        this.message = this.data.message || 'Are you sure?';
        this.confirmButtonText = this.data.buttonText.ok;
        this.cancelButtonText = this.data.buttonText.cancel;
      }
  }

  onConfirmClick(): void {
    this.dialogRef.close(true);
  } 
  
  onCancelClick(): void {
    this.dialogRef.close(false);
  }

  ngOnInit(): void {
  }

}

import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CheckInsService } from 'src/app/services/check-ins.service';

export interface DialogData {
  id: Int16Array,
  is_valid: boolean,
  points: Int16Array
}

@Component({
  selector: 'app-confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
  styleUrls: ['./confirm-dialog.component.scss']
})
export class ConfirmDialogComponent implements OnInit {
  is_valid: any;
  id: any;
  points: any;
  constructor(public dialogRef: MatDialogRef<ConfirmDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private readonly checkinsService: CheckInsService) {
      this.is_valid = data.is_valid,
      this.points = data.points;
      this.id = data.id;
     }

  ngOnInit(): void {
  }

  close(): void {
    this.dialogRef.close();
  }

  updateIsValidCheckin = async () => {
    await this.checkinsService.updateValidCheckin(this.id, !this.is_valid).then(response => {
      return this.dialogRef.close();
    })
  }

}

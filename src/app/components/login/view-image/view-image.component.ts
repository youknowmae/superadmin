import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-view-image',
  templateUrl: './view-image.component.html',
  styleUrl: './view-image.component.scss'
})
export class ViewImageComponent {

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private ref: MatDialogRef<ViewImageComponent>,
  ) {

  }
  
  closePopup() {
    this.ref.close(null);
  }
}

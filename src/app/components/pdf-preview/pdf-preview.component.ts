import { Component, Inject, Type } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-pdf-preview',
  templateUrl: './pdf-preview.component.html',
  styleUrl: './pdf-preview.component.scss',
})
export class PdfPreviewComponent {
  fileName: string = '';
  dataSource: SafeResourceUrl;

  docSource: string = '';
  viewerType: any;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private ref: MatDialogRef<PdfPreviewComponent>,
    private sanitizer: DomSanitizer
  ) {
    this.fileName = this.data.name;
    this.dataSource = this.sanitizer.bypassSecurityTrustResourceUrl(
      this.data.pdf
    );
    // console.log(this.pdfSource)

    // if(this.data.pdf) {
    //   this.viewerType = 'pdf'
    //   this.docSource = this.data.pdf //+ '#toolbar=0&navpanes=0&scrollbar=0'
    // }
  }
  closePopup() {
    this.ref.close(null);
  }
}

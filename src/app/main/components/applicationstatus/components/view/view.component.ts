import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DataService } from '../../../../../services/data.service';
// import { PdfPreviewComponent } from '../../../../../components/pdf-preview/pdf-preview.component';

@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrl: './view.component.scss'
})
export class ViewComponent {
  applicationDetails: any
  comments: any = []

  constructor(
    private ds: DataService,
    private route: ActivatedRoute,
  ) {
    this.route.paramMap.subscribe(params => {
      let id = params.get('id')

      if(!id) {
        return
      }
      
      this.getApplicationDetails(parseInt(id))
    });
  }

  getApplicationDetails(id: number) {
    this.ds.get('applications/', id).subscribe(
      applicationDetails=> {
        this.applicationDetails = applicationDetails
        console.log(this.applicationDetails)
        this.comments = this.applicationDetails.application_comments
      },
      error => {
        console.error(error)
      }
    )
  }

  // previewDocument(file: any) {
  //   this.dialogRef.open(PdfPreviewComponent, {
  //     data: { name: file.file_name, pdf: file.file_location},
  //     disableClose: true
  //   })
  // }

}

import { Component } from '@angular/core';
import { DataService } from '../../../../../services/data.service';

@Component({
  selector: 'app-list-application',
  templateUrl: './list.component.html',
  styleUrl: './list.component.scss'
})
export class ListComponent {
  applications: any = []
  

  constructor(
    private ds: DataService
  ) {

  }

  ngOnInit() {
    this.getApplicationList()
  }

  getApplicationList() {
    this.ds.get('student/applications').subscribe(
      applications => {
        this.applications = applications
        this.applications = applications.map((element: any) => {
          if(element.status == 0) {
            element.status_text = 'Pending'
          }
          if(element.status == 1) {
            element.status_text = 'Cancelled'
          }
          if(element.status == 2) {
            element.status_text = 'Rejected'
          }
          if(element.status == 3) {
            element.status_text = 'Approved'
          }

          return element
          
        });
        console.log(this.applications)
        // console.log(applications)
      },
      error => {
        console.error(error)
      }
    )

  }

}

import { Component } from '@angular/core';

import { DataService } from '../../../services/data.service';
import { announcement } from '../../../model/announcement.model';
import { MatDialog } from '@angular/material/dialog';
import { ViewComponent } from './components/view/view.component';

@Component({
  selector: 'app-announcement',
  templateUrl: './announcement.component.html',
  styleUrl: './announcement.component.scss'
})
export class AnnouncementComponent {
  announcements: announcement[] = []

  constructor(
    private ds: DataService, 
    private dialog: MatDialog
  ) {
  }

  ngOnInit() {
    this.getAnnouncements()
  }

  getAnnouncements() {
    this.ds.get('announcements').subscribe(
      announcements => {
        console.log(announcements)
        this.announcements = announcements
      },
      error => {
        console.error(error)
      }
    )
  }

  Openview(data: any) {
    this.dialog.open(ViewComponent, {
      data
    });
  }

}

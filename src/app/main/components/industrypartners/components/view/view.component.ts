import { Component } from '@angular/core';
import { IndustryPartner } from '../../../../../model/industry-partner.model';
import { GeneralService } from '../../../../../services/general.service';
import { UserService } from '../../../../../services/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrl: './view.component.scss'
})
export class ViewComponent {
  industryPartner: IndustryPartner = <IndustryPartner>{}
  student: any

  constructor(
    private gs: GeneralService,
    private us: UserService,
    private router: Router,
  ) {
  }

  ngOnInit() {
    this.getIndustryPartner()
    this.student = this.us.getUser()
  }
  
  getIndustryPartner() {
    this.industryPartner = this.us.getIndustryPartner()
  }

  navigateToApplication(id: number) {
    if(!this.student.personality_test){
      this.gs.infoAlert('Personality test is required!', 'Please do the personality test first to proceed.')
      this.router.navigate(['/main/profile'])

      return
    }
    this.router.navigate(['/main/industrypartners/apply/' + id])
  }



}

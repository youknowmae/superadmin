import { Component } from '@angular/core';
import { UserService } from '../../../../../../../services/user.service';
import { GeneralService } from '../../../../../../../services/general.service';
import { DataService } from '../../../../../../../services/data.service';

@Component({
  selector: 'app-view',
  templateUrl: './exit-poll.component.html',
  styleUrls: ['./exit-poll.component.scss']
})
export class ExitPollComponent {
  isLoading: boolean = true

  alphabet = 'abcdefghijklmnopqrstuvwxyz'.split('');
  shortAnswerQuestions = [
    'a. My scope of work is directly related to the academic program I am pursuing.',
    'b. I was given an orientation on the company organization and operations.',
    'c. I was given a job description on my specific duties and reporting relationships.',
    'd. My office/work hours were clear and convenient for me.',
    'e. I felt safe and secure in my work location and environment.',
    'f. I had no difficulty going to and from work.',
    'g. The company provided me with allowance, stipend, or subsidy indicate if _ _ _ meal or _ _ _ cash. If cash, how much? _ _ _/day'
  ];

  exitPollDetails: any;
  isGenerating: boolean = false

  constructor(
    private us: UserService,
    private gs: GeneralService, 
    private ds: DataService
  ) {
    this.getExitPollDetails();
  }

  getExitPollDetails() {
    let user = this.us.getStudentProfile()

    this.ds.get('superadmin/students/exit-poll/', user.id).subscribe(
      exitPollDetails=> {  
        this.isLoading = false
        exitPollDetails = exitPollDetails.data

        let supervisor = exitPollDetails.industry_partner.immediate_supervisor;
        let supervisorFullName = `${supervisor?.first_name || ''} ${supervisor?.last_name || ''} ${supervisor?.ext_name || ''}`.trim();
        exitPollDetails.industry_partner.immediate_supervisor.full_name = supervisorFullName;
        
        console.log(exitPollDetails)

        exitPollDetails.industry_partner.full_address =
            `${exitPollDetails.industry_partner.street} ${exitPollDetails.industry_partner.barangay} 
            ${exitPollDetails.industry_partner.municipality}, ${exitPollDetails.industry_partner.province}`;

        this.exitPollDetails = exitPollDetails
        
      },
      error => {
        this.isLoading = false
        console.error(error)
      }
    )
  }  
}

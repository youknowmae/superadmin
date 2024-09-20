import { Component } from '@angular/core';
import { IndustryPartner } from '../../../../../model/industry-partner.model';
import { DataService } from '../../../../../services/data.service';
import { GeneralService } from '../../../../../services/general.service';
import { UserService } from '../../../../../services/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-list-industry-partners',
  templateUrl: './list.component.html',
  styleUrl: './list.component.scss'
})
export class ListComponent {
  industryPartners: IndustryPartner[] = []
  isLoading: boolean = false
  isGettingPartner: boolean = false

  constructor(
    private ds: DataService,
    private gs: GeneralService,
    private us: UserService,
    private router: Router
  ) {

  }

  ngOnInit() {
    this.getIndustryPartners()
  }

  getIndustryPartners() {
    this.ds.get('industryPartners').subscribe(
      industryPartners => {
        this.industryPartners = industryPartners
        console.log(industryPartners)
      },
      error => {
        console.error(error)
      }
    )
  }

  getIndustryPartner(id: number) {
    if(this.isGettingPartner) {
      return
    }

    this.isGettingPartner = true
    
    this.ds.get('industryPartners/', id).subscribe(
      industryPartner => {
        this.us.setIndustryPartner(industryPartner)
        console.log(industryPartner)
        this.router.navigate(['main/industrypartners/view/' + id])
        this.isGettingPartner = false
      },
      error => {
        console.error(error)
        if(error.status === 404) {
          this.gs.errorAlert('Error!', 'Industry Partner not found.')
          this.isGettingPartner = false
        }
      }
    )
  }


}

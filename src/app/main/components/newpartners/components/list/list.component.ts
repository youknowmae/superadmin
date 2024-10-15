import { Component } from '@angular/core';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrl: './list.component.scss'
})
export class ListComponent {
  industryPartners: any = []

  constructor() {
    //sample data
    this.industryPartners.push({
      company_name: "Game Dev Corps",
      id: 1,
      image: "http://localhost:8000/storage/industryPartners/1728967656-sample logo.jpg",
      municipality: "Olongapo"
    })

    this.industryPartners.push({
      company_name: "similique animi accusantium",
      id: 2,
      image: null,
      municipality: "Olongapo"
    })
  }
  getIndustryPartner(id: number) {
    
  }

  editIndustryPartner(id: number) {
    
  }

  deleteConfirmation(id: number) {

  }
}

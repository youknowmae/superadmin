import { Component } from '@angular/core';
import { UserService } from '../../../../../../../services/user.service';
import { DataService } from '../../../../../../../services/data.service';
import { MatDialog } from '@angular/material/dialog';
import { ViewImageComponent } from '../../../../../../../components/login/view-image/view-image.component';

@Component({
  selector: 'app-studentprofile',
  templateUrl: './studentprofile.component.html',
  styleUrl: './studentprofile.component.scss'
})

export class StudentprofileComponent {
  student: any = {
    first_name: '',
    middle_name: '', 
    last_name: '', 
    ext_name: '', 
    student_number: "",
    email: "",
    birth_date: "",
    civil_status: "",
    gender: "",
    citizenship: "",
    religion: "",
    student_profile: {
      program: '',
      student_number: '',
      contact_number: "",
      father_name: "",
      father_employment: "",
      mother_name: "",
      mother_employment: "",
      region: "III",
      province: "Zambales", 
      municipality: "Olongapo",
      barangay: "East Tapinac",
      address: "#22 Donor Street",
      zip_code: "2200"
    }
  }

  seminar_total_hours: any = 0
  seminars: any = []
  skills: any = []
  personality_test: any = null

  constructor(
    private us: UserService,
    private ds: DataService,
    private dialog: MatDialog) {
  }

  ngOnInit() {
    this.student = this.us.getStudentProfile()
    this.student.gender = (this.student.gender == 0) ? 'Female' : 'Male'
    this.getSeminars();
    this.getSkills();
    this.getPersonalityTest();
  }

  getPersonalityTest() {
    this.ds.get('monitoring/personality-test/', this.student.id).subscribe(
      response => {
        console.log(response)
        this.personality_test = response
      },
      error => {
        console.error(error)
      }
    )
  }
  getSeminars() {
    this.ds.get('monitoring/seminar/', this.student.id).subscribe(
      response => {
        this.seminars = response
        this.seminars.forEach((seminar: any) => {
          this.seminar_total_hours += seminar.total_hours
        });
      },
      error => { 
        console.error(error)
      }
    )
  }

  getSkills() {
    this.ds.get('monitoring/skill-area/', this.student.id).subscribe(
      response => {
        console.log(response)
        this.skills = response
      },
      error => { 
        console.error(error)
      }
    )

  }

  viewSeminarImage(seminar: any) {
    this.dialog.open(ViewImageComponent, {
      data: { title: seminar.seminar_title, image: seminar.image}
    })
  }

  viewPersonalityTestImage(test: any) {
    this.dialog.open(ViewImageComponent, {
      data: { title: test.name, image: test.file}
    })
  }
}

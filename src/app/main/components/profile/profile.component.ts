import { Component } from '@angular/core';
import { UserService } from '../../../services/user.service';
import { GeneralService } from '../../../services/general.service';
import { DataService } from '../../../services/data.service';
import { MatDialog } from '@angular/material/dialog';
import { AddseminarComponent } from './components/addseminar/addseminar.component';
import { ViewImageComponent } from './components/view-image/view-image.component';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']  // Changed from `styleUrl` to `styleUrls`
})
export class ProfileComponent {
  student: any = {
    email: "",
    first_name: "",
    middle_name: "",
    last_name: "",
    ext_name: "",
    birth_date: "",
    gender: "",
    citizenship: "",
    religion: "",
    region: "",
    province: "",
    municipality: "",
    barangay: "",
    address: "",
    zip_code: "",
    student_profile: {
      civil_status: "",
      student_number: "",
      contact_number: "",
      program: "",
      year_level: '',
      father_name: "",
      father_employment: "",
      mother_name: "",
      mother_employment: "",
    },
  }

  personality_test: string = 'none'

  school_details: any = {
    school_year: "2024-2025",
    school_name: "Gordon College",
    school_address: "Olongapo City Sports Complex, Gordon College",
    zip_code: 2200
  }

  seminars: any = []
  seminar_total_hours: number = 0

  skills: any = []

  isEditingSkills: boolean = false
  
  skillFormDetails: FormGroup = this.fb.group({
    skills: this.fb.array([
      this.fb.group({
        strong_skill: [null, [Validators.required, Validators.maxLength(32)]],
        weak_skill: [null, [Validators.required, Validators.maxLength(32)]]
      }),
      this.fb.group({
        strong_skill: [null, [Validators.required, Validators.maxLength(32)]],
        weak_skill: [null, [Validators.required, Validators.maxLength(32)]]
      }),
      this.fb.group({
        strong_skill: [null, [Validators.required, Validators.maxLength(32)]],
        weak_skill: [null, [Validators.required, Validators.maxLength(32)]]
      }),
    ]),
  })

  constructor(
    private userService: UserService,
    private gs: GeneralService,
    private ds: DataService,
    private dialog: MatDialog,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.getProfile();
    this.getSeminars();
    this.getSkills();
  }

  getSeminars() {
    this.ds.get('profile/seminars').subscribe(
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
    this.ds.get('profile/skill-area').subscribe(
      response => {
        //placeholder
        if(response === null) {
          this.skills.push({strong_skill: '', weak_skill: ''})
          this.skills.push({strong_skill: '', weak_skill: ''})
          this.skills.push({strong_skill: '', weak_skill: ''})
          return
        }

        this.skills = response.skills
      },
      error => { 
        console.error(error)
      }
    )

  }

  uploadFile(event: any) {
    const file = event.target.files[0];

    const validImgType = ["image/jpeg", "image/png", "image/svg+xml"];
    let imgType = file.type;
    if (!validImgType.includes(imgType)) {
      this.gs.errorAlert('Error!', 'Invalid image type. It must be of type Jpeg, Png and svg only.');
      return;
    }

    const payload = new FormData();
    payload.append('file', file);

    this.ds.post('profile/personality-test', '', payload).subscribe(
      response => {
        this.gs.successAlert('Uploaded!', response.message);
        this.userService.setUser(this.student);
        this.personality_test = file.name;

        let student = { ...this.student, personality_test: file.name };
        this.userService.setUser(student);
      },
      error => {
        console.error(error);
        this.gs.errorAlert('Error!', 'Something went wrong please try again later.');
      }
    );
  }

  getProfile() {
    let profile = this.userService.getUser();

    if (profile.personality_test) {
      this.personality_test = profile.personality_test;
    }

    this.student = { ...profile };

    switch (this.student.gender) {
      case 0:
        this.student.gender = 'Female';
        break;
      case 1:
        this.student.gender = 'Male';
        break;
    }
  }

  Openaddseminar() {
    var modal = this.dialog.open(AddseminarComponent, {});

    modal.afterClosed().subscribe((result) => {
      console.log(result)
      if (!result) {
        return
      }
      
      this.seminars.push(result)

      this.seminar_total_hours = 0

      this.seminars.forEach((seminar: any) => {
        this.seminar_total_hours += parseInt(seminar.total_hours)
      });
    });
  }


  get skillForm(): FormArray {
    return this.skillFormDetails.get('skills') as FormArray;
  }
  
  editSkills() {
    this.skillFormDetails.get('skills.0')?.patchValue(this.skills[0])
    this.skillFormDetails.get('skills.1')?.patchValue(this.skills[1])
    this.skillFormDetails.get('skills.2')?.patchValue(this.skills[2])

    this.isEditingSkills = true
  }
  
  cancelEditSkills() {
    this.isEditingSkills = false
  }

  updateskills() {
    if(!this.skillFormDetails.valid) {
      return
    }

    console.log(this.skillFormDetails.value)
    Swal.fire({
      title: "Save?",
      text: "Are you sure you want to save this skills?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'Cancel',
      confirmButtonColor: "#4f6f52",
      cancelButtonColor: "#777777",
    }).then((result) => {
      if (result.isConfirmed) {
        this.ds.post('profile/skill-area', '', this.skillFormDetails.value).subscribe(
          response => {
            console.log(result)
            this.skills = response.data.skills
            this.gs.successToastAlert('Changes has been saved.')
            this.isEditingSkills = false
          },
          error => {
            console.error(error)
            Swal.fire({
              title: "error!",
              text: "Something went wrong, please try again later.",
              icon: "error",
            });
          }
        )
      }
    });
  }

  viewSeminarImage(seminar: any) {
    this.dialog.open(ViewImageComponent, {
      data: { title: seminar.seminar_title, image: seminar.image}
    })
  }
}

import { Component } from '@angular/core';
import { DataService } from '../../../services/data.service';
import { UserService } from '../../../services/user.service';
import Swal from 'sweetalert2';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { GeneralService } from '../../../services/general.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss'
})
export class SettingsComponent {
  ojtDurationFormDetails: FormGroup;
  isSubmitting: boolean = false;
  isLoading: boolean = true;

  currentAcadSemester: string = ''
  AcadYearArr: any = [];
  // Dropdown filter
  selectedAYFilter: string = 'all';
  selectedFilter: string = 'all';
  historyEntries: any[] = [];
  course: any = []

  constructor(
    private ds: DataService,
    private us: UserService,
    private fb: FormBuilder,
    private gs: GeneralService
  ) {
    this.ojtDurationFormDetails = this.fb.group({
      duration: this.fb.array([]),
    });
  }

  get duration() {
    return this.ojtDurationFormDetails.controls["duration"] as FormArray;
  }

  ngOnInit() {
    this.getOjtHours();
    this.getModificationHistory();
  }

  getOjtHours() {
    this.ds.get('superadmin/settings/required-ojt-hours').subscribe(
      response => {
        const data = response.data
        console.log(response);

        this.currentAcadSemester = data.acad_year_semester
        data.practicum_hours.forEach((element: any) => {
          this.course.push(element.course_code)

          const settingForm: FormGroup = this.fb.group({  
            course_code: [element.course_code, [Validators.required]],
            required_hours: [element.required_hours, [Validators.required, Validators.min(100), Validators.max(900), Validators.pattern("^[0-9]*$")]],
          });

          this.duration.push(settingForm);
        });
        this.isLoading = false;
      },
      error => {
        console.error(error);
        this.isLoading = false;
      }
    );
  }

  getModificationHistory() {
    this.ds.get('superadmin/settings/ojt-hours-history').subscribe(
      response => {
        this.historyEntries = response
        
        response.forEach((data: any) => {
          if (!this.AcadYearArr.includes(data.acad_year))
            this.AcadYearArr.push(data.acad_year)
        });
        console.log(response)
      },
      error => {
        console.error(error);
      }
    );
  }

  filteredHistory() {
    return this.selectedFilter === 'all' ? this.historyEntries : 
        this.historyEntries.filter(item => {
          return item.course_code.includes(this.selectedFilter)
        });
  }

  savePracticumHours() {
    Swal.fire({
      title: "Save?",
      text: "Your changes will be saved.",
      icon: "info",
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'Cancel',
      confirmButtonColor: "#4f6f52",
      cancelButtonColor: "#777777",
    }).then((result) => {
      if (result.isConfirmed) {
        if(this.isSubmitting){
          return;
        }

        this.isSubmitting = true;
        
        console.log(this.ojtDurationFormDetails.value);
        this.ds.post('superadmin/settings/required-ojt-hours', '', this.ojtDurationFormDetails.value).subscribe(
          response => {
            this.isSubmitting = false;
            this.gs.successToastAlert(response.message);
            this.getModificationHistory()
          },
          error => {
            this.isSubmitting = false;
            if(error.status === 422) {
              this.gs.errorAlert('Invalid Input!', 'Please check the input.');
            } else {
              this.gs.errorAlert('Oops!', 'Something went wrong. Please try again later.');
            }
            console.error(error);
          }
        );
      }
    });
  }
}

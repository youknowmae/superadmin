import { Component } from '@angular/core';
import { UserService } from '../../../../../../../services/user.service';
import { DataService } from '../../../../../../../services/data.service';
import { MatDialog } from '@angular/material/dialog';
import { ViewImageComponent } from '../../../../../../../components/login/view-image/view-image.component';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PdfPreviewComponent } from '../../../../../../../components/pdf-preview/pdf-preview.component';
import { AcademicYear } from '../../../../../../../model/academicYear.model';

@Component({
  selector: 'app-studentprofile',
  templateUrl: './studentprofile.component.html',
  styleUrl: './studentprofile.component.scss',
})
export class StudentprofileComponent {
  student: any = {
    first_name: '',
    middle_name: '',
    last_name: '',
    ext_name: '',
    student_number: '',
    email: '',
    birth_date: '',
    civil_status: '',
    gender: '',
    citizenship: '',
    religion: '',
    region: '',
    province: '',
    municipality: '',
    barangay: '',
    address: '',
    zip_code: '',
    student_profile: {
      program: '',
      student_number: '',
      contact_number: '',
      father_name: '',
      father_employment: '',
      mother_name: '',
      mother_employment: '',
    },
  };

  educationFormDetails: FormGroup = this.fb.group({
    type: [null, Validators.required],
    institution_name: [null, Validators.maxLength(64)],
    program: [null, Validators.maxLength(64)],
    year_graduated: [null, Validators.pattern(/^\d{4}$/)],
    nc_level: [null],
  });

  ojtInfo = {
    company_name: '',
    start_date: '',
    department: '',
    task: '',
    supervisor_full_name: '',
    supervisor_position: '',
    full_address: '',
  };

  seminars: any = [];
  other_tasks: any = [];
  community_service: any;

  community_service_total_hours: any = 0;
  seminar_total_hours: number = 0;
  other_task_total_hours: number = 0;
  skills: any = [];
  personality_test: any = null;

  constructor(
    private us: UserService,
    private ds: DataService,
    private dialog: MatDialog,
    private fb: FormBuilder,
    private userService: UserService
  ) {}

  ngOnInit() {
    this.student = this.us.getStudentProfile();
    this.getOjtInfo();
    this.student.gender = this.student.gender == 0 ? 'Female' : 'Male';

    let courseCode = this.student?.ojt_class.course_code;

    const level_2 = ['ITP422', 'CS422', 'DAP421'];
    const level_1 = ['ITP131', 'CS131', 'EMC131'];
    let practicum_level;

    if (level_2.includes(courseCode)) {
      practicum_level = 2;
    } else {
      practicum_level = 1;
    }

    this.student.practicum_level = practicum_level;

    if (this.student.student_skills) {
      this.skills = this.student.student_skills?.skill_areas;
    } else {
      this.skills.push({ strong_skill: '', weak_skill: '' });
      this.skills.push({ strong_skill: '', weak_skill: '' });
      this.skills.push({ strong_skill: '', weak_skill: '' });
    }

    if (this.student.practicum_level === 2) {
      this.getCommunityService();
    } else {
      this.getOtherTask();
      this.getSeminars();
    }

    this.getPersonalityTest();
  }

  profilePictureUrl: string | null = null;

  getProfilePicture() {
    this.ds.download('student/profile/picture').subscribe(
      (response: Blob) => {
        this.profilePictureUrl = URL.createObjectURL(response);
        console.log(this.profilePictureUrl);
      },
      (error) => {
        console.error(error);
      }
    );
  }

  getPersonalityTest() {
    this.ds
      .get('superadmin/students/personality-test/', this.student.id)
      .subscribe(
        (response) => {
          console.log(response);
          this.personality_test = response;
        },
        (error) => {
          // console.error(error)
        }
      );
  }

  getCommunityService() {
    const acadYear: AcademicYear = this.us.getSelectedAcademicYears();

    this.ds
      .get(
        `superadmin/students/community-service/${this.student.id}`,
        `?acad_year=${acadYear.acad_year}&semester=${acadYear.semester}`
      )
      .subscribe(
        (response) => {
          this.community_service = response;
          if (response.is_verified) this.community_service_total_hours = 150;
        },
        (error) => {
          // console.error(error)
        }
      );
  }

  getOtherTask() {
    const acadYear: AcademicYear = this.us.getSelectedAcademicYears();

    this.ds
      .get(
        `superadmin/students/other-task/${this.student.id}`,
        `?acad_year=${acadYear.acad_year}&semester=${acadYear.semester}`
      )
      .subscribe(
        (response) => {
          this.other_tasks = response;
          this.other_tasks.forEach((data: any) => {
            this.other_task_total_hours += data.total_hours;
          });
        },
        (error) => {
          console.error(error);
        }
      );
  }

  getSeminars() {
    const acadYear: AcademicYear = this.us.getSelectedAcademicYears();
    this.ds
      .get(
        `superadmin/students/seminar/${this.student.id}`,
        `?acad_year=${acadYear.acad_year}&semester=${acadYear.semester}`
      )
      .subscribe(
        (response) => {
          this.seminars = response;
          this.seminars.forEach((seminar: any) => {
            this.seminar_total_hours += seminar.total_hours;
          });
        },
        (error) => {
          console.error(error);
        }
      );
  }

  viewSeminarImage(seminar: any) {
    this.dialog.open(ViewImageComponent, {
      data: { title: seminar.seminar_title, image: seminar.image },
    });
  }

  viewPersonalityTestImage(test: any) {
    this.dialog.open(ViewImageComponent, {
      data: { title: test.file_name, image: test.file_path },
    });
  }

  viewCommunityService(communityService: any) {
    this.dialog.open(PdfPreviewComponent, {
      data: {
        name: communityService.project_name,
        pdf: communityService.file_path,
      },
    });
  }

  getOjtInfo() {
    const acadYear: AcademicYear = this.us.getSelectedAcademicYears();

    this.ds
      .get(
        `superadmin/students/ojt-information/${this.student.id}`,
        `?acad_year=${acadYear.acad_year}&semester=${acadYear.semester}`
      )
      .subscribe(
        (response) => {
          let data = {
            ...response.industry_partner,
            ...response,
          };

          let supervisor = data.immediate_supervisor;
          let supervisorFullName = `${supervisor?.first_name || ''} ${
            supervisor?.last_name || ''
          } ${supervisor?.ext_name || ''}`.trim();
          data.supervisor_full_name = supervisorFullName;

          let full_address = `${data?.street || ''} ${data?.barangay || ''} ${
            data?.municipality || ''
          }, ${data?.province || ''}`;
          data.full_address = full_address;

          this.ojtInfo = data;
          console.log(this.ojtInfo);
        },
        (error) => {
          // console.error(error)
        }
      );
  }
}

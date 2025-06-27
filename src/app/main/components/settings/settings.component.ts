import { Component } from '@angular/core';
import { DataService } from '../../../services/data.service';
import { UserService } from '../../../services/user.service';
import Swal from 'sweetalert2';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { GeneralService } from '../../../services/general.service';
import { MatSelectChange } from '@angular/material/select';
import { AcademicYear } from '../../../model/academicYear.model';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss',
})
export class SettingsComponent {
  academicYearOptions: any = [];
  academicYearFilter: any;

  moaSignatoriesFormDetails: FormGroup;

  ojtDurationFormDetails: FormGroup;
  isSubmitting: boolean = false;
  isLoading: boolean = true;

  historyEntries: any[] = [];
  course: any = [];

  constructor(
    private ds: DataService,
    private us: UserService,
    private fb: FormBuilder,
    private gs: GeneralService
  ) {
    this.moaSignatoriesFormDetails = this.fb.group({
      college_president: [
        null,
        [Validators.required, Validators.maxLength(128)],
      ],
      ccs_dean: [null, [Validators.required, Validators.maxLength(128)]],
    });
    this.ojtDurationFormDetails = this.fb.group({
      duration: this.fb.array([]),
    });
  }

  onAcademicYearFilterChange(event: MatSelectChange) {
    this.duration.clear();
    this.isLoading = true;

    const acadYear = event.value;
    this.academicYearFilter = acadYear;
    this.getModificationHistory(acadYear);
    this.getOjtHours(acadYear);
  }

  get duration() {
    return this.ojtDurationFormDetails.controls['duration'] as FormArray;
  }

  ngOnInit() {
    let academicYears = this.us.getAcademicYears();
    this.academicYearOptions = academicYears;
    const activeAcadYear = academicYears.find(
      (item: any) => item.is_active === 1
    );

    this.academicYearFilter = activeAcadYear;

    this.getOjtHours(activeAcadYear);
    this.getModificationHistory(activeAcadYear);
    this.getMoaSignatories();
  }

  async saveMoaSignatories() {
    if (this.moaSignatoriesFormDetails.invalid) {
      this.moaSignatoriesFormDetails.markAllAsTouched();
      this.gs.makeToast('Invalid Input!', 'error');
      return;
    }

    const res = await this.gs.confirmationAlert(
      'Update?',
      'Are you sure you want to update the mou signatories.',
      'info',
      'Yes',
      'confirmation'
    );

    if(!res) return

    const payload = {
      payload: this.us.encryptPayload(this.moaSignatoriesFormDetails.value)
    }
    this.ds
      .post(
        'superadmin/settings/signatories',
        '',
        payload
      )
      .subscribe({
        next: (response: any) => {
          console.log(response);
          this.gs.makeAlert(
            'Updated',
            'Moa Signatories has been updated!',
            'success'
          );
        },
        error: (err: any) => {
          console.log(err);
          this.gs.makeAlert(
            'Oops!',
            'Something went wrong. Please try again later.',
            'error'
          );
        },
      });
  }

  getMoaSignatories() {
    this.ds.get('superadmin/settings/signatories').subscribe({
      next: (response: any) => {
        response.forEach((item: any) => {
          if (item.label_type === 0) {
            this.moaSignatoriesFormDetails.patchValue({
              college_president: item.name,
            });
          } else {
            this.moaSignatoriesFormDetails.patchValue({
              ccs_dean: item.name,
            });
          }
        });
      },
      error: (err: any) => {
        console.log(err);
      },
    });
  }

  getOjtHours(acadYear: AcademicYear) {
    this.ds
      .get(
        `superadmin/settings/required-ojt-hours?acad_year=${acadYear.acad_year}&semester=${acadYear.semester}`
      )
      .subscribe(
        (response) => {
          const data = response.data;
          console.log(response);

          data.practicum_hours.forEach((element: any) => {
            this.course.push(element.course_code);

            const settingForm: FormGroup = this.fb.group({
              course_code: [element.course_code, [Validators.required]],
              required_hours: [
                element.required_hours,
                [
                  Validators.required,
                  Validators.min(100),
                  Validators.max(900),
                  Validators.pattern('^[0-9]*$'),
                ],
              ],
            });

            this.duration.push(settingForm);
          });
          this.isLoading = false;
        },
        (error) => {
          console.error(error);
          this.isLoading = false;
        }
      );
  }

  getModificationHistory(acadYear: AcademicYear) {
    this.ds
      .get(
        `superadmin/settings/ojt-hours-history?acad_year=${acadYear.acad_year}&semester=${acadYear.semester}`
      )
      .subscribe(
        (response) => {
          this.historyEntries = response;
          console.log(response);
        },
        (error) => {
          console.error(error);
        }
      );
  }

  async savePracticumHours() {
    const res = await this.gs.confirmationAlert(
      'Save?',
      'Your changes will be saved.',
      'info',
      'Save'
    );

    if (!res) return;

    if (this.isSubmitting) return;
    this.isSubmitting = true;

    let acadYear: AcademicYear = this.academicYearFilter;
    const payload = {
      payload: this.us.encryptPayload(this.ojtDurationFormDetails.value)
    };
    this.ds
      .post(
        `superadmin/settings/required-ojt-hours?acad_year=${acadYear.acad_year}&semester=${acadYear.semester}`,
        '',
        payload
      )
      .subscribe(
        (response) => {
          this.isSubmitting = false;
          this.gs.makeToast(response.message, 'success');
          this.getModificationHistory(this.academicYearFilter);
        },
        (error) => {
          console.log(error);
          this.isSubmitting = false;
          if (error.status === 409) {
            this.gs.makeAlert(error.error.title, error.error.message, 'error');
          } else if (error.status === 422) {
            this.gs.makeAlert(
              error.error.title || 'Invalid Input!',
              error.error.message || 'Please check your input.',
              'error'
            );
          } else {
            this.gs.makeAlert(
              'Oops!',
              'Something went wrong. Please try again later.',
              'error'
            );
          }
          console.error(error);
        }
      );
  }
}

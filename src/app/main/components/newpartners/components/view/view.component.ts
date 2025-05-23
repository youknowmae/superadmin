import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../../../services/user.service';
import { DataService } from '../../../../../services/data.service';
import { GeneralService } from '../../../../../services/general.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { DomSanitizer } from '@angular/platform-browser';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrl: './view.component.scss',
})
export class ViewComponent {
  industryPartner: any;

  accountDetails: FormGroup;
  formDetails: FormGroup;

  showPassword: boolean = false;
  isSubmitting: boolean = false;

  file: any;
  filePreview: any;
  isImage: boolean = false;

  isLoading: boolean = true;

  constructor(
    private us: UserService,
    private ds: DataService,
    private gs: GeneralService,
    private fb: FormBuilder,
    private router: Router,
    private sanitizer: DomSanitizer
  ) {
    this.accountDetails = this.fb.group({
      email: [null, [Validators.required, Validators.email]],
      password: [null, [Validators.required, Validators.minLength(8)]],
      slots: [
        null,
        [Validators.required, Validators.min(1), Validators.max(50)],
      ],
    });

    this.formDetails = this.fb.group({
      startDate: [null, Validators.required],
      endDate: [{ value: null, disabled: true }], // disabled because automatic
    })

    this.formDetails.get('startDate')?.valueChanges.subscribe((startDateValue: string) => {
      const endDateControl = this.formDetails.get('endDate');

      if (startDateValue) {
        const start = new Date(startDateValue);
        const end = new Date(start);
        end.setFullYear(end.getFullYear() + 1); // add 1 year

        // Format date to yyyy-MM-dd string
        const yyyy = end.getFullYear();
        const mm = (end.getMonth() + 1).toString().padStart(2, '0');
        const dd = end.getDate().toString().padStart(2, '0');
        const endDateStr = `${yyyy}-${mm}-${dd}`;

        // ✅ Enable endDate if disabled
        if (endDateControl?.disabled) {
          endDateControl.enable({ emitEvent: false });
        }

        // ✅ Set value without triggering event
        endDateControl?.setValue(endDateStr, { emitEvent: false });
      } else {
        // ✅ Reset and disable if no startDate
        endDateControl?.setValue(null, { emitEvent: false });
        endDateControl?.disable({ emitEvent: false });
      }
    });
  }

  ngOnInit() {
    this.getAddRequest();
  }

  getAddRequest() {
    let id = this.us.getIndustryPartnerAddRequest();

    if (!id) {
      this.router.navigate(['main/newpartners/list']);
      return;
    }

    this.ds.get('superadmin/request/industryPartners/', id).subscribe(
      (response) => {
        console.log(response);

        let industryPartner = response;

        let companyHead = industryPartner.company_head;
        let fullName = `${companyHead?.first_name || ''} ${
          companyHead?.last_name || ''
        } ${companyHead?.ext_name || ''}`.trim();
        industryPartner.company_head.full_name = fullName;

        let supervisor = industryPartner.immediate_supervisor;
        let supervisorFullName = `${supervisor?.first_name || ''} ${
          supervisor?.last_name || ''
        } ${supervisor?.ext_name || ''}`.trim();
        industryPartner.immediate_supervisor.full_name = supervisorFullName;

        let full_address = `${industryPartner?.street || ''} ${
          industryPartner?.barangay || ''
        }, ${industryPartner?.municipality || ''}`;
        industryPartner.full_address = full_address;

        this.industryPartner = industryPartner;

        this.accountDetails.patchValue({
          email: industryPartner.email,
        });

        this.isLoading = false;
      },
      (error) => {
        if (error.status === 404) {
          this.router.navigate(['main/newpartners/list']);
          this.gs.makeAlert(
            'Not Found!',
            'The industry partner approval not found.',
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
        this.isLoading = false;
      }
    );
  }

  approveConfirmation() {
    Swal.fire({
      title: 'Approve?',
      text: 'Are you sure you want to Approve this company?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'Cancel',
      confirmButtonColor: '#4f6f52',
      cancelButtonColor: '#777777',
    }).then((result) => {
      if (result.isConfirmed) {
        this.approvePartner();
      }
    });
  }

  approvePartner() {
    if (this.isSubmitting) {
      return;
    }

    this.isSubmitting = true;

    const formdata = new FormData();

    formdata.append('mou', this.file);
    formdata.append('email', this.accountDetails.value.email);
    formdata.append('password', this.accountDetails.value.password);
    formdata.append('slots', this.accountDetails.value.slots);

    this.ds
      .post(
        'superadmin/request/industryPartners/',
        this.industryPartner.id,
        formdata
      )
      .subscribe(
        (response) => {
          this.isSubmitting = false;
          console.log(response);
          this.gs.makeAlert(response.title, response.message, 'success');
          this.router.navigate(['main/newpartners/list']);
        },
        (error) => {
          this.isSubmitting = false;
          if (error.status === 409) {
            this.gs.makeAlert(error.error.title, error.error.message, 'error');
          } else if (error.status == 422) {
            this.gs.makeAlert(
              error.error.title || 'Invalid Input!',
              error.error.error || 'Please check your input',
              'error'
            );
          } else {
            this.gs.makeAlert(
              'Oops',
              'Something went wrong. Please try again later.',
              'error'
            );
          }
          console.log(error);
        }
      );
  }

  downloadDocx() {
    this.isSubmitting = true;

    this.ds
      .download(
        'superadmin/request/industryPartners/mou/',
        this.industryPartner.id
      )
      .subscribe(
        (response: Blob) => {
          saveAs(response, 'MOU.docx');
          this.isSubmitting = false;
        },
        (error) => {
          this.gs.makeAlert(
            'Error!',
            'Something went wrong. Please try again later.',
            'error'
          );
          console.error(error);
          this.isSubmitting = false;
        }
      );
  }

  sanitizeUrl(url: string) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  uploadFile(event: any) {
    this.file = event.target.files[0];

    let file = this.file;

    const fileType = file.type;

    if (fileType.startsWith('image/')) {
      this.isImage = true;
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.filePreview = e.target.result;
      };
      reader.readAsDataURL(file);
    } else if (fileType === 'application/pdf') {
      this.isImage = false;
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.filePreview = this.sanitizer.bypassSecurityTrustResourceUrl(
          e.target.result + '#toolbar=0&navpanes=0&scrollbar=0'
        );
      };
      reader.readAsDataURL(file);
    }
  }

  reject() {
    Swal.fire({
      title: 'Please state the reason for declining.',
      input: 'text',
      inputAttributes: {
        autocapitalize: 'off',
      },
      showCancelButton: true,
      confirmButtonText: 'Decline',
      cancelButtonText: 'Cancel',
      confirmButtonColor: '#ff4141',
      cancelButtonColor: '#777777',
    }).then((result) => {
      if (result.isConfirmed) {
        const formData = new FormData();
        formData.append('remarks', result.value);
        this.ds
          .post(
            'superadmin/request/industryPartners/reject/',
            this.industryPartner.id,
            formData
          )
          .subscribe(
            (response) => {
              this.gs.makeAlert(response.title, response.message, 'success');
              this.router.navigate(['main/newpartners/list']);
              this.industryPartner.status = 3;
            },
            (error) => {
              console.error(error);
              if (error.status === 409) {
                this.gs.makeAlert(
                  error.error.title,
                  error.error.message,
                  'error'
                );
              } else if (error.status === 422) {
                this.gs.makeAlert(
                  error.error.title,
                  error.error.message,
                  'error'
                );
              } else {
                this.gs.makeAlert(
                  'Oops!',
                  'Something went wrong. Please try again later.',
                  'error'
                );
              }
            }
          );
      }
    });
  }
}

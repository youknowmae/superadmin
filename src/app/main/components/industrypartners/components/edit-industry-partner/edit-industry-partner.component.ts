import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DataService } from '../../../../../services/data.service';
import Swal from 'sweetalert2';
import { GeneralService } from '../../../../../services/general.service';
import { LocationService } from '../../../../../services/location.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-edit-industry-partner',
  templateUrl: './edit-industry-partner.component.html',
  styleUrl: './edit-industry-partner.component.scss',
})
export class EditIndustryPartnerComponent {
  file: any = null;

  titles: string[] = ['Sr', 'Jr', 'II', 'III', 'IV', 'V'];

  isSubmitting: boolean = false;

  formDetails: FormGroup;
  mouFormDetails: FormGroup;

  regions: any = [];
  provinces: any = [];
  municipalities: any = [];
  barangays: any = [];

  selectedFile: File | null = null;
  isDragOver = false;
  filePreviewUrl: SafeResourceUrl | null = null;
  fileName: string | null = null;

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) {
      this.handleFile(input.files[0]);
    }
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    this.isDragOver = false;

    if (event.dataTransfer?.files.length) {
      this.handleFile(event.dataTransfer.files[0]);
    }
  }

  handleFile(file: File): void {
    const validType = 'application/pdf';
    const maxSize = 10 * 1024 * 1024; // 10MB

    if (file.type === validType && file.size <= maxSize) {
      this.selectedFile = file;
      this.fileName = file.name;

      const reader = new FileReader();
      reader.onload = () => {
        // Sanitize the base64 URL to safely bind it to iframe src
        this.filePreviewUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
          reader.result as string
        );
      };
      reader.readAsDataURL(file); // Convert PDF to base64
    } else {
      alert('Only PDF files under 10MB are allowed.');
      this.selectedFile = null;
      this.fileName = null;
      this.filePreviewUrl = null;
    }
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    this.isDragOver = true;
  }

  onDragLeave(event: DragEvent): void {
    this.isDragOver = false;
  }

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private ref: MatDialogRef<EditIndustryPartnerComponent>,
    private fb: FormBuilder,
    private dataService: DataService,
    private gs: GeneralService,
    private ls: LocationService,
    private sanitizer: DomSanitizer
  ) {
    this.mouFormDetails = this.fb.group({
      start_date: [null, Validators.required],
      expiration_date: [{ value: null, disabled: true }, Validators.required],
    });

    this.formDetails = this.fb.group({
      company_name: [null, [Validators.required, Validators.maxLength(64)]],
      description: [null, [Validators.required, Validators.maxLength(2048)]],

      company_head: this.fb.group({
        first_name: [null, [Validators.required, Validators.maxLength(64)]],
        middle_name: [null, [Validators.maxLength(64)]],
        last_name: [null, [Validators.required, Validators.maxLength(64)]],
        ext_name: [null],
        sex: [null, Validators.required],
      }),

      head_position: [null, [Validators.required, Validators.maxLength(64)]],

      immediate_supervisor: this.fb.group({
        first_name: [null, [Validators.required, Validators.maxLength(64)]],
        middle_name: [null, [Validators.maxLength(64)]],
        last_name: [null, [Validators.required, Validators.maxLength(64)]],
        ext_name: [null],
        sex: [null, Validators.required],
      }),

      supervisor_position: [
        null,
        [Validators.required, Validators.maxLength(64)],
      ],

      region: [null, [Validators.required]],
      province: [null, [Validators.required]],
      municipality: [null, [Validators.required]],
      barangay: [null, [Validators.required]],
      street: [null, [Validators.required, Validators.maxLength(128)]],

      telephone_number: [null, [Validators.pattern('^[0-9 ()-]+$')]],
      mobile_number: [
        null,
        [Validators.required, Validators.pattern('^[0-9 ()-]+$')],
      ],
      fax_number: [null, [Validators.pattern('^[0-9 ()-]+$')]],
      email: [null, [Validators.required, Validators.email]],
      website: [null, [Validators.maxLength(128)]],

      slots: [
        null,
        [Validators.required, Validators.min(1), Validators.max(50)],
      ],
    });

    this.mouFormDetails
      .get('start_date')
      ?.valueChanges.subscribe((startDateValue: string) => {
        const endDateControl = this.mouFormDetails.get('expiration_date');

        if (startDateValue) {
          const start = new Date(startDateValue);
          const end = new Date(start);
          end.setFullYear(end.getFullYear() + 1);

          if (endDateControl?.disabled) {
            endDateControl.enable({ emitEvent: false });
          }

          // ✅ Set value without triggering event
          endDateControl?.setValue(this.gs.formatDate(end), {
            emitEvent: false,
          });
        } else {
          // ✅ Reset and disable if no startDate
          endDateControl?.setValue(null, { emitEvent: false });
          endDateControl?.disable({ emitEvent: false });
        }
      });
  }

  async ngOnInit() {
    this.formDetails.patchValue({
      ...this.data,
    });

    this.regions = await this.ls.getRegions();
    let regionFormValue = this.regions.find(
      (data: any) => data.regDesc === this.data.region
    );

    this.provinces = await this.ls.getProvinces(regionFormValue.regCode);
    let provinceFormValue = this.provinces.find(
      (data: any) => data.provDesc === this.data.province
    );

    this.municipalities = await this.ls.getMunicipalities(
      provinceFormValue.provCode
    );
    let municipalityFormValue = this.municipalities.find(
      (data: any) => data.citymunDesc === this.data.municipality
    );

    console.log(this.municipalities);
    this.barangays = await this.ls.getBarangays(
      municipalityFormValue.citymunCode
    );
    let barangayFormValue = this.barangays.find(
      (data: any) => data.brgyDesc === this.data.barangay
    );

    this.formDetails.patchValue({
      region: regionFormValue,
      province: provinceFormValue,
      municipality: municipalityFormValue,
      barangay: barangayFormValue,
    });
  }

  async onRegionChange(region: any) {
    let regCode = region.regCode;
    // console.log(region)
    this.provinces = [];
    this.municipalities = [];
    this.barangays = [];

    this.formDetails.patchValue({
      municipality: null,
      province: null,
      barangay: null,
    });

    console.log(this.formDetails.value);
    this.provinces = await this.ls.getProvinces(regCode);
  }

  async onProvinceChange(province: any) {
    // console.log(province)

    this.municipalities = [];
    this.barangays = [];

    this.formDetails.patchValue({
      municipality: null,
      barangay: null,
    });

    this.municipalities = await this.ls.getMunicipalities(province.provCode);
  }
  async onMunicipalityChange(municipality: any) {
    // console.log(municipality)

    this.barangays = [];

    this.formDetails.patchValue({
      barangay: null,
    });

    this.barangays = await this.ls.getBarangays(municipality.citymunCode);
  }

  uploadFile(event: any) {
    this.file = event.target.files[0];
  }

  closePopup() {
    Swal.fire({
      title: 'Cancel',
      text: 'Are you sure you want to cancel editing industry partner??',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
      confirmButtonColor: '#AB0E0E',
      cancelButtonColor: '#777777',
    }).then((result) => {
      if (result.isConfirmed) {
        this.ref.close(null);
        this.gs.makeToast('Changes not saved.', 'error');
      }
    });
  }

  async updateProfile() {
    if (this.formDetails.invalid) {
      const firstInvalidControl: HTMLElement =
        document.querySelector('form .ng-invalid')!;

      if (firstInvalidControl) {
        firstInvalidControl.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
        });
      }

      this.formDetails.markAllAsTouched();
      return;
    }

    const res = await this.gs.confirmationAlert(
      'Update?',
      'Are you sure you want to update this industry partner?',
      'info',
      'Yes',
      'confirmation'
    );

    if (!res) return;

    if (this.isSubmitting) {
      return;
    }

    this.isSubmitting = true;

    var formData = new FormData();

    const partnerInfo = this.formDetails.value
    formData.append('company_name', partnerInfo.company_name);
    formData.append('description', partnerInfo.description);
    formData.append('region', partnerInfo.region?.regDesc);
    formData.append('province', partnerInfo.province?.provDesc);
    formData.append('municipality', partnerInfo.municipality?.citymunDesc);
    formData.append('barangay', partnerInfo.barangay?.brgyDesc);
    formData.append('street', partnerInfo.street);

    if (partnerInfo.telephone_number)
      formData.append('telephone_number', partnerInfo.telephone_number);

    formData.append('mobile_number', partnerInfo.mobile_number);

    if (partnerInfo.fax_number)
      formData.append('fax_number', partnerInfo.fax_number);

    formData.append('email', partnerInfo.email);

    if (partnerInfo.website) formData.append('website', partnerInfo.website);

    formData.append('slots', partnerInfo.slots);

    const companyHead = this.formDetails.get('company_head')?.value;
    formData.append('company_head[first_name]', companyHead.first_name);
    if (companyHead.middle_name)
      formData.append('company_head[middle_name]', companyHead.middle_name);
    formData.append('company_head[last_name]', companyHead.last_name);
    formData.append('company_head[sex]', companyHead.sex);
    if (companyHead.ext_name)
      formData.append('company_head[ext_name]', companyHead.ext_name);

    formData.append(
      'head_position',
      this.formDetails.get('head_position')?.value
    );

    const supervisor = this.formDetails.get('immediate_supervisor')?.value;
    formData.append('immediate_supervisor[first_name]', supervisor.first_name);
    if (supervisor.middle_name)
      formData.append(
        'immediate_supervisor[middle_name]',
        supervisor.middle_name
      );
    formData.append('immediate_supervisor[last_name]', supervisor.last_name);
    formData.append('immediate_supervisor[sex]', supervisor.sex);
    if (supervisor.ext_name)
      formData.append('immediate_supervisor[ext_name]', supervisor.ext_name);

    formData.append(
      'supervisor_position',
      this.formDetails.get('supervisor_position')?.value
    );

    if (this.file) formData.append('image', this.file);

    this.dataService
      .post('superadmin/industryPartners/', this.data.id, formData)
      .subscribe(
        (result) => {
          this.isSubmitting = false;
          this.gs.makeAlert(result.title, result.message, 'success');
          this.ref.close(result.data);
        },
        (error) => {
          this.isSubmitting = false;
          console.error(error);
          if (error.status == 422) {
            this.gs.makeAlert('Error!', 'Invalid input.', 'error');
          } else {
            this.gs.makeAlert(
              'Oops!',
              'Something went wrong, please try again later.',
              'error'
            );
          }
        }
      );
  }
}

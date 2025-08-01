import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DataService } from '../../../../../services/data.service';
import { GeneralService } from '../../../../../services/general.service';
import { LocationService } from '../../../../../services/location.service';
import { UserService } from '../../../../../services/user.service';

@Component({
  selector: 'app-add-industry-partner',
  templateUrl: './add-industry-partner.component.html',
  styleUrl: './add-industry-partner.component.scss',
})
export class AddIndustryPartnerComponent {
  file: any = null;
  today: Date = new Date();

  titles: string[] = ['Sr', 'Jr', 'II', 'III', 'IV', 'V'];

  showPassword: boolean = false;

  formDetails: FormGroup;
  mouFormDetails: FormGroup;

  isSubmitting: boolean = false;

  regions: any = [];
  provinces: any = [];
  municipalities: any = [];
  barangays: any = [];

  selectedFile: File | null = null;
  isDragOver = false;
  filePreviewUrl: string | null = null;
  fileName: string | null = null;
  mouSubscription: any;

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
    const validTypes = [
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/pdf',
      'image/png',
      'image/webp',
      'text/csv',
      'text/plain',
      'application/zip',
    ];
    const maxSize = 10 * 1024 * 1024; // 10MB

    if (validTypes.includes(file.type) && file.size <= maxSize) {
      this.selectedFile = file;
      this.fileName = file.name;

      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = () => {
          this.filePreviewUrl = reader.result as string;
        };
        reader.readAsDataURL(file);
      } else {
        this.filePreviewUrl = null;
      }
    } else {
      alert('Invalid file type or size exceeds 10MB.');
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
    private ref: MatDialogRef<AddIndustryPartnerComponent>,
    private fb: FormBuilder,
    private ds: DataService,
    private gs: GeneralService,
    private ls: LocationService,
    private us: UserService
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

      telephone_number: ['', [Validators.pattern('^[0-9 ()-]+$')]],
      mobile_number: [
        null,
        [Validators.required, Validators.pattern('^[0-9 ()-]+$')],
      ],
      fax_number: ['', [Validators.pattern('^[0-9 ()-]+$')]],
      email: [null, [Validators.required, Validators.email]],
      website: ['', [Validators.maxLength(128)]],

      password: [null, [Validators.required, Validators.minLength(8)]],
      slots: [
        null,
        [Validators.required, Validators.min(1), Validators.max(50)],
      ],
    });

    this.mouSubscription = this.mouFormDetails
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
  ngOnDestroy(): void {
    this.mouSubscription?.unsubscribe();
  }

  async ngOnInit() {
    this.regions = await this.ls.getRegions();
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

  async closePopup() {
    const res = await this.gs.confirmationAlert(
      'Cancel?',
      'Are you sure you want to cancel adding industry partner?',
      'info',
      'Yes',
      'confirmation'
    );

    if (!res) return;

    this.ref.close(null);
    this.gs.makeToast('Changes not saved.', 'error');
  }

  async submit() {
    if (!this.file) {
      this.gs.makeAlert('Invalid Input!', 'Company logo is required.', 'error');
      return;
    }

    if (!this.selectedFile) {
      this.gs.makeAlert('Invalid Input!', 'MOU is required.', 'error');
      return;
    }

    const res = await this.gs.confirmationAlert(
      'Add?',
      'Are you sure you want to add this industry partner?',
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

    let partnerInfo = this.formDetails.value;
    const mouInfo = this.mouFormDetails.value;

    partnerInfo.region = partnerInfo.region?.regDesc || '';
    partnerInfo.province = partnerInfo.province?.provDesc || '';
    partnerInfo.municipality = partnerInfo.municipality?.citymunDesc || '';
    partnerInfo.barangay = partnerInfo.barangay?.brgyDesc || '';

    partnerInfo.start_date = this.gs.formatDate(mouInfo.start_date);
    partnerInfo.expiration_date = this.gs.formatDate(mouInfo.expiration_date);

    console.log(partnerInfo);

    formData.append('payload', this.us.encryptPayload(partnerInfo));
    //files
    formData.append('mou', this.selectedFile);
    formData.append('image', this.file);

    this.ds.post('superadmin/industryPartners', '', formData).subscribe(
      (result) => {
        this.isSubmitting = false;
        this.gs.makeAlert(result.title, result.message, 'success');
        this.ref.close(result.data);
      },
      (error) => {
        this.isSubmitting = false;
        console.error(error);
        if (error.status == 422) {
          this.gs.makeAlert(
            error.error.title || 'Invalid Input!',
            error.error.message || 'Please check your input..',
            'error'
          );
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

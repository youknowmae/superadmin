import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DataService } from '../../../../../services/data.service';
import { GeneralService } from '../../../../../services/general.service';

@Component({
  selector: 'app-edit-template',
  templateUrl: './edit-template.component.html',
  styleUrl: './edit-template.component.scss',
})
export class EditTemplateComponent {
  docxFile: any = null;
  pdfFile: any = null;

  formDetails: FormGroup = this.fb.group({
    name: [null, [Validators.required, Validators.maxLength(128)]],
  });

  isSubmitting: boolean = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private ref: MatDialogRef<EditTemplateComponent>,
    private fb: FormBuilder,
    private gs: GeneralService,
    private ds: DataService
  ) {}

  ngOnInit() {
    this.formDetails.patchValue({
      name: this.data.name,
    });
  }

  uploadDocxFile(event: any) {
    this.docxFile = event.target.files[0];
  }

  uploadPdfFile(event: any) {
    this.pdfFile = event.target.files[0];
  }

  async closePopup() {
    const res = await this.gs.confirmationAlert(
      'Cancel?',
      'Are you sure you want to cancel editing template?',
      'question'
    );

    if (!res) return;

    this.ref.close(null);
    this.gs.makeToast('Changes not saved.', 'error');
  }

  async submit() {
    const res = await this.gs.confirmationAlert(
      'Update?',
      'Are you sure you want to update this template?',
      'info',
      'Update',
      'confirmation'
    );

    if (!res) return;

    var formDetails = this.formDetails.value;

    var payload = new FormData();
    payload.append('name', formDetails.name);

    if (this.docxFile) {
      payload.append('docx', this.docxFile);
    }

    if (this.pdfFile) {
      payload.append('pdf', this.pdfFile);
    }

    if (this.isSubmitting) {
      return;
    }

    this.isSubmitting = true;

    this.ds.post('superadmin/templates/', this.data.id, payload).subscribe(
      (result) => {
        this.isSubmitting = false;
        this.gs.makeAlert('Success!', result.message, 'success');
        this.ref.close(result.data);
      },
      (error) => {
        this.isSubmitting = false;
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

import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DataService } from '../../../../../services/data.service';
import Swal from 'sweetalert2';
import { GeneralService } from '../../../../../services/general.service';

@Component({
  selector: 'app-add-template',
  templateUrl: './add-template.component.html',
  styleUrl: './add-template.component.scss',
})
export class AddTemplateComponent {
  docxFile: any = null;
  pdfFile: any = null;

  formDetails: FormGroup = this.fb.group({
    name: [null, [Validators.required, Validators.maxLength(128)]],
  });

  isSubmitting: boolean = false;

  constructor(
    private ref: MatDialogRef<AddTemplateComponent>,
    private fb: FormBuilder,
    private gs: GeneralService,
    private ds: DataService
  ) {}

  uploadDocxFile(event: any) {
    this.docxFile = event.target.files[0];
  }

  uploadPdfFile(event: any) {
    this.pdfFile = event.target.files[0];
  }

  async closePopup() {
    const res = await this.gs.confirmationAlert(
      'Cancel?',
      'Are you sure you want to cancel adding template?',
      'question'
    );

    if (!res) return;

    this.ref.close(null);
    this.gs.makeToast('Changes not saved.', 'error');
  }

  async submit() {
    const res = await this.gs.confirmationAlert(
      'Create?',
      'Are you sure you want to create this template?',
      'info',
      'Yes',
      'confirmation'
    );

    if (!res) return;

    var formDetails = this.formDetails.value;

    var payload = new FormData();
    payload.append('name', formDetails.name);

    if (!this.docxFile) {
      this.gs.makeAlert('Error', 'Docx file is required.', 'error');
      return;
    }

    if (!this.pdfFile) {
      this.gs.makeAlert('Error', 'Pdf file is required.', 'error');
      return;
    }

    payload.append('docx', this.docxFile);
    payload.append('pdf', this.pdfFile);

    if (this.isSubmitting) {
      return;
    }

    this.isSubmitting = true;

    this.ds.post('superadmin/templates', '', payload).subscribe(
      (result) => {
        this.isSubmitting = false;
        Swal.fire({
          title: 'Success!',
          text: result.message,
          icon: 'success',
        });
        this.ref.close(result.data);
      },
      (error) => {
        this.isSubmitting = false;
        if (error.status == 422) {
          this.gs.makeAlert(error.error.title  || 'Error!', error.error.message || 'Invalid input.', 'error');
        } else {
          this.gs.makeAlert(
            'Error!',
            'Something went wrong, please try again later.',
            'error'
          );
        }
      }
    );
  }
}

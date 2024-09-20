import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DataService } from '../../../../../services/data.service';
import Swal from 'sweetalert2';
import { GeneralService } from '../../../../../services/general.service';
// import { DatePipe } from '@angular/common';
import * as moment from 'moment-timezone';


@Component({
  selector: 'app-addattendance',
  templateUrl: './addattendance.component.html',
  styleUrl: './addattendance.component.scss'
})
export class AddattendanceComponent {
  file: any = null

  formDetails: FormGroup = this.fb.group({
    date: [null, Validators.required],
    activity_description: [null, [Validators.required, Validators.maxLength(2048) ]],
    arrival_time: [null, Validators.required],
    departure_time: [null, Validators.required],
    total_hours: [null, [Validators.required, Validators.pattern('^([1-9]|[1][0-8])$')]],
  })


  constructor(
    private ref: MatDialogRef<AddattendanceComponent>,
    private fb: FormBuilder,
    private gs: GeneralService,
    private dataService: DataService,
    // private datePipe: DatePipe
  ) {
  }

  closepopup() {
    Swal.fire({
      title: "Cancel",
      text: "Are you sure you want to close the attendance form?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
      confirmButtonColor: "#AB0E0E",
      cancelButtonColor: "#777777",
    }).then((result) => {
      if (result.isConfirmed) {
        this.ref.close(null);
        this.gs.errorToastAlert('Change not saved.')
      }
    });
  }

  submit() {
    Swal.fire({
      title: "Create?",
      text: "Are you sure you want to submit attendance?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'Cancel',
      confirmButtonColor: "#4f6f52",
      cancelButtonColor: "#777777",
    }).then((result) => {
      if (result.isConfirmed) {
        this.create()
      }
    });
  }

  timeToFloat(timeString: string) {
    const [hours, minutes] = timeString.split(':').map(Number);

    return hours + minutes / 60;
  }

  create() {
    let arrival_time = this.timeToFloat(this.formDetails.value.arrival_time)
    let departure_time = this.timeToFloat(this.formDetails.value.departure_time)

    let available_working_time = departure_time - arrival_time

    console.log(new Date(this.formDetails.value.date).toISOString().split('T')[0])

    if(this.formDetails.value.total_hours > available_working_time) {
      this.gs.errorAlert('Error!', 'Invalid total hours.')
      return
    }

    const form = new FormData 

    form.append('date', moment.tz(this.formDetails.value.date, 'Asia/Manila').format('YYYY-MM-DD'))
    form.append('activity_description', this.formDetails.value.activity_description)
    form.append('arrival_time', this.formDetails.value.arrival_time)
    form.append('departure_time', this.formDetails.value.departure_time)
    form.append('total_hours', this.formDetails.value.total_hours)

    this.dataService.post('student/accomplishment-report/attendance', '', form).subscribe(
      result => {
        Swal.fire({
          title: "Success!",
          text: result.message,
          icon: "success",
        });
        this.ref.close(result.data);

      },
      error => {
        console.error(error)
        if (error.status == 422) {
          Swal.fire({
            title: "error!",
            text: "Invalid input.",
            icon: "error",
          });
        }
        else {
          Swal.fire({
            title: "error!",
            text: "Something went wrong, please try again later.",
            icon: "error",
          });
        }
      }
    )
  }
}

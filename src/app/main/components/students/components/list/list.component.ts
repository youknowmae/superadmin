import { Component, ViewChild, ChangeDetectorRef } from '@angular/core';

import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

import { DataService } from '../../../../../services/data.service';
import { UserService } from '../../../../../services/user.service';

import { Router } from '@angular/router';

import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { MatSelectChange } from '@angular/material/select';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrl: './list.component.scss'
})
export class ListComponent {
  displayedColumns: string[] = ['name', 'student_number', 'mobile', 'course', 'program', 'year_level', 'time_completion', 'status', 'actions'];

  unfilteredStudents: any
  dataSource: any = new MatTableDataSource<any>();

  isLoading: boolean = false

  classList: any = []
  statusFilter: string = 'all'
  classFilter: string = 'all'
  
  @ViewChild(MatPaginator, {static:true}) paginator!: MatPaginator;
  
  constructor(
    private paginatorIntl: MatPaginatorIntl, 
    private changeDetectorRef: ChangeDetectorRef,
    private router: Router,
    private ds: DataService,
    private us: UserService
  ) {
    this.paginator = new MatPaginator(this.paginatorIntl, this.changeDetectorRef);
  }

  ngOnInit() {
    this.getStudents()
  }

  getStudents() {
    this.ds.get('superadmin/students').subscribe(
      students => {
        // console.log(students)
        let studentsList = students.map((student: any) => {
          //get all classes
          if (!this.classList.includes(student.active_ojt_class.class_code)) 
            this.classList.push(student.active_ojt_class.class_code) 

          if(student.ojt_exit_poll) {
            student.ojt_exit_poll = "Answered"
          }

          if(student.student_evaluation) {
            student.student_evaluation = student.student_evaluation.average
          }

          let required_hours: number = student.active_ojt_class.required_hours
          let progress: number = 0

          //if has accomplishment report
          if(student.accomplishment_report.length > 0) {
            student.accomplishment_report = student.accomplishment_report[0]
            progress += parseInt(student.accomplishment_report.current_total_hours)
          }


          let status = (student.accepted_application) ? 'Ongoing' : 'Pending'

          if(progress >= required_hours && student.ojt_exit_poll && student.student_evaluation) {
            status = "Completed"
          }

          return {
            full_name: student.first_name + " " + student.last_name,
            progress,
            status,
            ...student
          } 
        })

        console.log(studentsList)
        this.unfilteredStudents = studentsList
        this.dataSource.data = studentsList
        this.dataSource.paginator = this.paginator;
      },
      error => {
        console.error(error)
      }
    )
  }

  onClassFilterChange(event: MatSelectChange) {
    this.classFilter = event.value

    this.statusFilter = 'all'
    this.applyFilter()
  }

  onStatusFilterChange(value: string) {
    this.statusFilter = value
    this.applyFilter()
  }
  
  applyFilter() {
    //class filter
    let students = this.unfilteredStudents
    
    if(this.classFilter != 'all') {
      students = students.filter((student: any) => {
        return student.active_ojt_class.class_code === this.classFilter
      })
    }

    if(this.statusFilter != "all") {
      students = students.filter((student: any) => {
        return student.status.toLowerCase() === this.statusFilter
      })    
    }

    this.dataSource.data = students
  }

  viewStudent(id: number) {
    if(this.isLoading) {
      return
    }

    let studentDetails = this.unfilteredStudents.find((student: any) => student.id = id)

    console.log(studentDetails)
    this.ds.get('monitoring/students/', id).subscribe(
      student => {
        this.us.setStudentProfile({ ...student, required_hours: studentDetails.required_hours })
        this.router.navigate(['main/students/view'])
        this.isLoading = false
      },
      error => {
        console.error(error)
        this.isLoading = false
      }
    )
  }

  downloadExcel() {
    const data: any = this.generateExcelContent();
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(data);
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');


    const excelBuffer: any = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });

    const file = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    if (file) {
      saveAs(file, 'Report.xlsx');
    } else {
      console.error('Error generating Excel file data.');
    }
  }

  generateExcelContent() {
    console.log('generating excel...')

    let data: any = []

    //header
    data.push([
      'Last Name', 
      'First Name', 
      'Student Number', 
      'Program', 
      'Year Level', 
      'Course', 
      'Class Code', 
      'Required OJT Hours', 
      'Rendered OJT Hours',
      'Student Evaluation', 
      'Exit Poll',
      'Remarks'
    ])

    let students = this.dataSource.data;

    students = students.sort((a: any, b: any) => a.last_name.localeCompare(b.last_name))

    students.forEach((student: any) => {
      data.push([
        student.last_name,
        student.first_name,
        student.student_profile.student_number,
        student.student_profile.program,
        student.student_profile.year_level,
        student.active_ojt_class.course_code,
        student.active_ojt_class.class_code,
        student.active_ojt_class.required_hours,
        student.progress,
        (student.student_evaluation) ? student.student_evaluation : 'Not Evaluated',
        (student.ojt_exit_poll) ? 'Completed' : 'INC',
        (student.status === 'Completed') ? 'Completed': 'Incomplete',
      ]);
    });


    console.log(data)

    return data;
  }


}

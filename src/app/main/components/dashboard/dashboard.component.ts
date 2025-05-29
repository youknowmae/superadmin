import { Component, AfterViewInit } from '@angular/core';
import {
  Chart,
  ChartConfiguration,
  registerables,
  ArcElement,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
} from 'chart.js';
import { channel } from 'diagnostics_channel';
import { DataService } from '../../../services/data.service';
import { UserService } from '../../../services/user.service';
import { AcademicYear } from '../../../model/academicYear.model';
import { MatSelectChange } from '@angular/material/select';
import { Workbook } from 'exceljs';
import * as FileSaver from 'file-saver';

// Register all necessary components
Chart.register(...registerables);
Chart.register(
  ArcElement,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale
);

interface OjtStatus {
  pending: number;
  ongoing: number;
  completed: number;
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements AfterViewInit {
  academicYearOptions: any = [];
  academicYearFilter: any;

  enrolled_student: number = 0;
  ojtStatusCount: any = {
    completed: 0,
    ongoing: 0,
    pending: 0,
  };
  enrolledCourseCount: any = [];

  totalEnrolledCoursePie: any;
  barChart: any;
  ojtBarChart: any;
  evaluationBarChart: any;

  public config: ChartConfiguration<'pie'> = {
    type: 'pie',
    data: {
      datasets: [
        {
          data: [0, 0, 0, 0],
          backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0'],
          hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0'],
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          display: true,
          position: 'top',
        },
        tooltip: {
          enabled: true,
        },
      },
    },
  };

  public barConfig: ChartConfiguration<'bar'> = {
    type: 'bar',
    data: {
      labels: ['BSIT', 'BSCS', 'BSEMC'],
      datasets: [
        {
          label: 'Pending',
          data: [0, 0, 0],
          backgroundColor: '#FABC3F',
        },
        {
          label: 'Ongoing',
          data: [0, 0, 0],
          backgroundColor: '#99B080',
        },
        {
          label: 'Completed',
          data: [0, 0, 0],
          backgroundColor: '#7C93C3',
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          display: true,
          position: 'top',
        },
        tooltip: {
          enabled: true,
        },
      },
      scales: {
        x: {
          stacked: false,
          ticks: {
            maxRotation: 0,
            minRotation: 0,
          },
        },
        y: {
          stacked: false,
        },
      },
    },
  };

  constructor(private ds: DataService, private us: UserService) {}

  ngOnInit() {
    let academicYears = this.us.getAcademicYears();
    this.academicYearOptions = academicYears;
    const activeAcadYear = academicYears.find(
      (item: any) => item.is_active === 1
    );

    this.academicYearFilter = activeAcadYear;

    this.getData(activeAcadYear);
  }

  ngAfterViewInit(): void {
    this.totalEnrolledCoursePie = new Chart('pieChart', this.config);
    this.barChart = new Chart('barChart', this.barConfig);
  }

  onAcademicYearFilterChange(event: MatSelectChange) {
    const acadYear = event.value;
    this.academicYearFilter = acadYear;
    this.getData(acadYear);
  }

  
blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result);
      } else {
        reject('Failed to convert blob to base64');
      }
    };
    reader.onerror = () => reject('Failed to read blob');
    reader.readAsDataURL(blob);
  });
}


exportToExcel = async (): Promise<void> => {
  const workbook = new Workbook();
  const worksheet = workbook.addWorksheet('Dashboard Report');

  // Load and add images as base64
  const gcImageResponse = await fetch('assets/images/GC.png');
  const gcImageBlob = await gcImageResponse.blob();
  const gcImageBase64 = await this.blobToBase64(gcImageBlob);
  const gcLogo = workbook.addImage({
    base64: gcImageBase64,
    extension: 'png',
  });

  const ccsImageResponse = await fetch('assets/images/ccs.png');
  const ccsImageBlob = await ccsImageResponse.blob();
  const ccsImageBase64 = await this.blobToBase64(ccsImageBlob);
  const ccsLogo = workbook.addImage({
    base64: ccsImageBase64,
    extension: 'png',
  });

  let currentRow = 1;

  // Add logos
  worksheet.addImage(gcLogo, {
    tl: { col: 0, row: currentRow - 1 },
    ext: { width: 120, height: 120 },
    editAs: 'absolute',
  });

  worksheet.addImage(ccsLogo, {
    tl: { col: 5, row: currentRow - 1 },
    ext: { width: 120, height: 120 },
    editAs: 'absolute',
  });

  currentRow += 1;

  const addHeaderLine = (text: string, fontSize: number, bold = false) => {
    worksheet.mergeCells(`A${currentRow}:N${currentRow}`);
    const cell = worksheet.getCell(`A${currentRow}`);
    cell.value = text;
    cell.alignment = { vertical: 'middle', horizontal: 'center' };
    cell.font = { size: fontSize, bold };
    currentRow++;
  };

  addHeaderLine('Gordon College', 16, true);
  addHeaderLine('College of Computer Studies', 12);
  addHeaderLine(`A.Y. ${this.academicYearFilter.acad_year || 'N/A'}`, 12);
  addHeaderLine('Dashboard Report', 12);

  worksheet.addRow([]);
  currentRow++;

  const addSectionTitle = (title: string) => {
    const row = worksheet.getRow(currentRow++);
    row.height = 24;
    row.getCell(1).value = title;
    row.font = { bold: true, color: { argb: 'FFFFFFFF' }, size: 14 };
    row.alignment = { vertical: 'middle', horizontal: 'center' };
    row.eachCell({ includeEmpty: true }, (cell, colNumber) => {
      if (colNumber <= 6) {
        cell.fill = {
          type: 'gradient',
          gradient: 'angle',
          degree: 0,
          stops: [
            { position: 0, color: { argb: 'FFEE7214' } },
            { position: 1, color: { argb: 'FFB85400' } },
          ],
        };
        cell.font = { bold: true, color: { argb: 'FFFFFFFF' }, size: 14 };
        cell.alignment = { vertical: 'middle', horizontal: 'center' };
      }
    });
    worksheet.mergeCells(`A${row.number}:F${row.number}`);
  };

  const addHeaders = (headers: string[]) => {
    const row = worksheet.getRow(currentRow++);
    row.height = 20;
    headers.forEach((header, i) => {
      const cell = row.getCell(i + 1);
      cell.value = header;
      if (i < 6) {
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FFEE7214' },
        };
      }
      cell.font = { bold: true, color: { argb: 'FFFFFFFF' } };
      cell.alignment = { horizontal: 'center', vertical: 'middle' };
      cell.border = {
        top: { style: 'thin', color: { argb: 'FFDD7700' } },
        left: { style: 'thin', color: { argb: 'FFDD7700' } },
        bottom: { style: 'thin', color: { argb: 'FFDD7700' } },
        right: { style: 'thin', color: { argb: 'FFDD7700' } },
      };
    });
  };

  const addDataRows = (rows: any[][]) => {
    rows.forEach((data, idx) => {
      const row = worksheet.getRow(currentRow++);
      row.height = 18;
      data.forEach((val, i) => {
        const cell = row.getCell(i + 1);
        cell.value = val;
        if (i < 6 && idx % 2 === 0) {
          cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FFFFF3E6' },
          };
        }
        cell.alignment = { horizontal: 'center', vertical: 'middle' };
        cell.border = {
          top: { style: 'thin', color: { argb: 'FFF5C27A' } },
          left: { style: 'thin', color: { argb: 'FFF5C27A' } },
          bottom: { style: 'thin', color: { argb: 'FFF5C27A' } },
          right: { style: 'thin', color: { argb: 'FFF5C27A' } },
        };
      });
    });
  };

  // ✅ SECTION: Dashboard Summary
  addSectionTitle('Dashboard Summary');
  addHeaders([
    'Total Students Enrolled',
    'Pending Student Applicants',
    'Students in Ongoing OJT',
    'OJT-Completed Students',
  ]);

  addDataRows([[
    this.enrolled_student,
    this.ojtStatusCount?.pending || 0,
    this.ojtStatusCount?.ongoing || 0,
    this.ojtStatusCount?.completed || 0,
  ]]);


  currentRow++;

  // SECTION: Enrolled Students
  addSectionTitle('Enrolled Students per Course');
  addHeaders(['Course Code', 'Count']);
  const enrolledRows = this.enrolledCourseCount.map((item: any) => [
    item.course_code,
    item.count,
  ]);
  addDataRows(enrolledRows);

  currentRow++;

  // SECTION: OJT Status
  addSectionTitle('OJT Status per Course');
  addHeaders(['Course Code', 'Pending', 'Ongoing', 'Completed']);
  const ojtStatusRows = this.barChart?.data?.labels?.map((label: string, i: number) => [
    label,
    this.barChart.data.datasets[0].data[i],
    this.barChart.data.datasets[1].data[i],
    this.barChart.data.datasets[2].data[i],
  ]) || [];
  addDataRows(ojtStatusRows);

  currentRow++;

  // Autofit columns only A-F
  worksheet.columns.forEach((col, idx) => {
    if (idx < 6) {
      let maxLength = 12;
      if (col.eachCell) {
        col.eachCell({ includeEmpty: true }, (cell) => {
          const val = cell.value ? cell.value.toString() : '';
          maxLength = Math.max(maxLength, val.length);
        });
      }
      col.width = maxLength + 4;
    } else {
      col.width = 0;
    }
  });

  // Save Excel file
  workbook.xlsx.writeBuffer().then((buffer: any) => {
    const blob = new Blob([buffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });
    FileSaver.saveAs(blob, 'Dashboard_Report.xlsx');
  });
};


  getData(acadYear: AcademicYear) {
    this.ds
      .get(
        `superadmin/dashboard?acad_year=${acadYear.acad_year}&semester=${acadYear.semester}`
      )
      .subscribe(
        (response) => {
          let totalEnrolledStudent: number = 0;
          let ojtStatusCount = {
            pending: 0,
            ongoing: 0,
            completed: 0,
          };
          let enrolledCoursesCount: { [courseCode: string]: number } = {};
          let statusByCourse: { [courseCode: string]: OjtStatus } = {};

          console.log(response);
          response.forEach((student: any) => {
            const ojt_class = {
              ...student.ojt_class,
              ...student.ojt_class.adviser_class,
              ...student.ojt_class.adviser_class.active_ojt_hours,
            };
            const courseCode = ojt_class.course_code;

            totalEnrolledStudent += 1;
            const requiredHours = ojt_class.required_hours;
            const renderedHours =
              student.verified_attendance_total?.current_total_hours || 0;

            //initialize object
            if (!statusByCourse[courseCode]) {
              statusByCourse[courseCode] = {
                pending: 0,
                ongoing: 0,
                completed: 0,
              };
            }

            if (
              renderedHours >= requiredHours &&
              student.ojt_exit_poll &&
              student.student_evaluation
            ) {
              ojtStatusCount.completed += 1;
              statusByCourse[courseCode].completed += 1;
            } else if (student.has_accepted_application) {
              ojtStatusCount.ongoing += 1;
              statusByCourse[courseCode].ongoing += 1;
            } else {
              ojtStatusCount.pending += 1;
              statusByCourse[courseCode].pending += 1;
            }

            if (enrolledCoursesCount[courseCode]) {
              enrolledCoursesCount[courseCode] += 1;
            } else {
              enrolledCoursesCount[courseCode] = 1;
            }
          });

          const courseCountArray = Object.entries(enrolledCoursesCount).map(
            ([courseCode, count]) => ({
              course_code: courseCode,
              count,
            })
          );

          this.enrolled_student = totalEnrolledStudent;
          this.ojtStatusCount = ojtStatusCount;
          this.enrolledCourseCount = courseCountArray;

          this.totalEnrolledCoursePie.data.labels = courseCountArray.map(
            (item: any) => item.course_code
          );

          this.totalEnrolledCoursePie.data.datasets[0].data =
            courseCountArray.map((item: any) => item.count);

          this.totalEnrolledCoursePie.update();

          const statusByCourseArray = Object.entries(statusByCourse).map(
            ([courseCode, data]) => ({
              course_code: courseCode,
              ...data,
            })
          );
          console.log(statusByCourseArray);

          this.barChart.data.labels = [];
          this.barChart.data.datasets[0].data = [];
          this.barChart.data.datasets[1].data = [];
          this.barChart.data.datasets[2].data = [];
          statusByCourseArray.forEach((item: any) => {
            this.barChart.data.labels.push(item.course_code);
            this.barChart.data.datasets[0].data.push(item.pending);
            this.barChart.data.datasets[1].data.push(item.ongoing);
            this.barChart.data.datasets[2].data.push(item.completed);
          });

          this.barChart.update();
        },
        (error) => {
          console.error(error);
        }
      );
  }
}

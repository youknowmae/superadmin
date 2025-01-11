import { Component, AfterViewInit } from '@angular/core';
import { Chart, ChartConfiguration, registerables, ArcElement, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js';
import { channel } from 'diagnostics_channel';
import { DataService } from '../../../services/data.service';

// Register all necessary components
Chart.register(...registerables);
Chart.register(ArcElement, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements AfterViewInit {

  enrolled_student: number = 0
  student_ojt_status_count: any = {
    completed: 0,
    ongoing: 0,
    pending: 0,
  }

  pieChart: any;
  barChart: any;
  ojtBarChart: any;
  evaluationBarChart: any;

  public config: ChartConfiguration<'pie'> = {
    type: 'pie',
    data: {
      labels: ['BSIT', 'BSCS', 'BSEMC'],
      datasets: [{
        data: [0, 0, 0, 0],
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0'],
        hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0']
      }]
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
        }
      }
    }
  };

  public barConfig: ChartConfiguration<'bar'> = {
    type: 'bar',
    data: {
      labels: ['BSIT', 'BSCS', 'BSEMC'],
      datasets: [
        {
          label: 'Pending',
          data: [0, 0, 0, 0],
          backgroundColor: '#FABC3F'
        },
        {
          label: 'Ongoing',
          data: [0, 0, 0, 0],
          backgroundColor: '#99B080'
        },
        {
          label: 'Completed',
          data: [0, 0, 0, 0],
          backgroundColor: '#7C93C3'
        }
      ]
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
        }
      },
      scales: {
        x: {
          stacked: true
        },
        y: {
          stacked: true
        }
      }
    }
  };

  constructor(
    private ds: DataService
  ) { }

  ngAfterViewInit(): void {
    this.pieChart = new Chart('pieChart', this.config);
    this.barChart = new Chart('barChart', this.barConfig);


    this.getData()
  }

  getData() {
    this.ds.get('superadmin/dashboard').subscribe(
      response => {
        console.log(response)
        this.enrolled_student = response.enrolled_student
        this.student_ojt_status_count = response.student_ojt_status_count

        // ['BSIT', 'BSCS', 'BSEMC', 'ACT']
        this.pieChart.data.datasets[0].data = [
          response.student_program_count.bsit,
          response.student_program_count.bscs,
          response.student_program_count.bsemc,
          response.student_program_count.act,
        ];
        this.pieChart.update()

        this.barChart.data.datasets[0].data = [
          response.student_ojt_status.bsit.pending,
          response.student_ojt_status.bscs.pending,
          response.student_ojt_status.bsemc.pending,
          response.student_ojt_status.act.pending,
        ]       

        this.barChart.data.datasets[1].data = [
          response.student_ojt_status.bsit.ongoing,
          response.student_ojt_status.bscs.ongoing,
          response.student_ojt_status.bsemc.ongoing,
          response.student_ojt_status.act.ongoing,
        ]       

        this.barChart.data.datasets[2].data = [
          response.student_ojt_status.bsit.completed,
          response.student_ojt_status.bscs.completed,
          response.student_ojt_status.bsemc.completed,
          response.student_ojt_status.act.completed,
        ]       
        this.barChart.update()
      },
      error => {
        console.error(error)
      }
    )
  }
}

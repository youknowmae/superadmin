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
      labels: ['BSIT', 'BSCS', 'BSEMC', 'ACT'],
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
      labels: ['BSIT', 'BSCS', 'BSEMC', 'ACT'],
      datasets: [
        {
          label: 'Pending',
          data: [0, 0, 0, 0],
          backgroundColor: '#FABC3F'
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

  public ojtBarConfig: ChartConfiguration<'bar'> = {
    type: 'bar',
    data: {
      labels: ['BSIT', 'BSCS', 'BSEMC', 'ACT'],
      datasets: [
        {
          label: 'Pending',
          data: [0, 0, 0, 0],
          backgroundColor: '#FABC3F'
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

  public evaluationConfig: ChartConfiguration<'bar'> = {
    type: 'bar',
    data: {
      labels: ['BSIT', 'BSCS', 'BSEMC', 'ACT'],
      datasets: [
        {
          label: '100-96',
          data: [0, 0, 0, 0],
          backgroundColor: '#FABC3F'
        },
        {
          label: '95-91',
          data: [0, 0, 0, 0],
          backgroundColor: '#7C93C3'
        },
        {
          label: '90-86',
          data: [0, 0, 0, 0],
          backgroundColor: '#A1D6B2'
        },
        {
          label: '85-81',
          data: [0, 0, 0, 0],
          backgroundColor: '#FF9874'
        },
        {
          label: '80-75',
          data: [0, 0, 0, 0],
          backgroundColor: '#AD49E1'
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
    this.ojtBarChart = new Chart('ojtBarChart', this.ojtBarConfig);
    this.evaluationBarChart = new Chart('evaluationBarChart', this.evaluationConfig);


    this.getData()
  }

  getData() {
    this.ds.get('dashboard/student-info').subscribe(
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

        // ['BSIT', 'BSCS', 'BSEMC', 'ACT'],
        //dataset 0 = pending
        //dataset 1 = completed
        this.ojtBarChart.data.datasets[0].data = [
          response.student_exit_poll.bsit.pending,
          response.student_exit_poll.bscs.pending,
          response.student_exit_poll.bsemc.pending,
          response.student_exit_poll.act.pending,
        ]       
        this.ojtBarChart.data.datasets[1].data = [
          response.student_exit_poll.bsit.completed,
          response.student_exit_poll.bscs.completed,
          response.student_exit_poll.bsemc.completed,
          response.student_exit_poll.act.completed,
        ]       
        this.ojtBarChart.update()

        this.barChart.data.datasets[0].data = [
          response.student_ojt_status.bsit.pending,
          response.student_ojt_status.bscs.pending,
          response.student_ojt_status.bsemc.pending,
          response.student_ojt_status.act.pending,
        ]       

        this.barChart.data.datasets[1].data = [
          response.student_ojt_status.bsit.completed,
          response.student_ojt_status.bscs.completed,
          response.student_ojt_status.bsemc.completed,
          response.student_ojt_status.act.completed,
        ]       
        this.barChart.update()

        this.evaluationBarChart.data.datasets[0].data = [
          response.student_performance_evaluation.bsit.excellent,
          response.student_performance_evaluation.bscs.excellent,
          response.student_performance_evaluation.bsemc.excellent,
          response.student_performance_evaluation.act.excellent,
        ]
        
        this.evaluationBarChart.data.datasets[1].data = [
          response.student_performance_evaluation.bsit.very_good,
          response.student_performance_evaluation.bscs.very_good,
          response.student_performance_evaluation.bsemc.very_good,
          response.student_performance_evaluation.act.very_good,
        ];

        this.evaluationBarChart.data.datasets[2].data = [
          response.student_performance_evaluation.bsit.good,
          response.student_performance_evaluation.bscs.good,
          response.student_performance_evaluation.bsemc.good,
          response.student_performance_evaluation.act.good,
        ];

        this.evaluationBarChart.data.datasets[3].data = [
          response.student_performance_evaluation.bsit.fair,
          response.student_performance_evaluation.bscs.fair,
          response.student_performance_evaluation.bsemc.fair,
          response.student_performance_evaluation.act.fair,
        ];

        this.evaluationBarChart.data.datasets[4].data = [
          response.student_performance_evaluation.bsit.poor,
          response.student_performance_evaluation.bscs.poor,
          response.student_performance_evaluation.bsemc.poor,
          response.student_performance_evaluation.act.poor,
        ];

        this.evaluationBarChart.update()
      },
      error => {
        console.error(error)
      }
    )
  }
}

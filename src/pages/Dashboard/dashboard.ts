import { Component, ViewChild, OnInit } from '@angular/core';
import { DashboardService } from '../../Services/dashboard.service';
import { ISalesData } from '../../Model/Dashboard.model';
import { Chart } from 'chart.js';
import { Router } from '@angular/router';
import { NgbCalendar, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
@Component({
    // tslint:disable-next-line:component-selector
    selector: 'page-dashboard',
    templateUrl: 'dashboard.html',
    providers: [DashboardService]
})
// tslint:disable-next-line:component-class-suffix
export class Dashboard implements OnInit {
    saleValues: any = [];
    saleData: ISalesData[];

    @ViewChild('barCanvas') barCanvas;
    @ViewChild('lineCanvas') lineCanvas;
    @ViewChild('lineCanvas2') lineCanvas2;

    barChart: any;
    profitSaleslineChart: any;
    purchaseSaleslineChart: any;
    model: NgbDateStruct;
    today = this.calendar.getToday();

    date = new Date();
    firstDay = new Date(this.date.getFullYear(), this.date.getMonth(), 1);
    lastDay = new Date(this.date.getFullYear(), this.date.getMonth() + 1, 0);

    fromDate: any = this.firstDay.toISOString().split('T')[0];
    toDate: any = this.lastDay.toISOString().split('T')[0];

    // tslint:disable-next-line:variable-name
    constructor(public _router: Router, private _dashboardService: DashboardService, private calendar: NgbCalendar) {

    }

    ngOnInit() {
        this._dashboardService.getPurchase_SalesData(this.fromDate, this.toDate).then((response) => {
            this.saleData = response;
            console.log(JSON.stringify(this.saleData));

            // tslint:disable-next-line:prefer-for-of
            for (let i = 0; i < this.saleData.length; i++) {
                this.saleValues.push(this.saleData[i].TotalAmount);
            }
            console.log(this.saleValues);
        });
    }

    ionViewDidLoad() {
        this.barChart = new Chart(this.barCanvas.nativeElement, {
            type: 'bar',
            data: {
                labels: ['U1', 'U2', 'U3', 'U4', 'U5', 'U6'],
                datasets: [{
                    label: 'Cust/Sale',
                    data: [45, 26, 34, 54, 28, 37],
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.2)',
                        'rgba(54, 162, 235, 0.2)',
                        'rgba(255, 206, 86, 0.2)',
                        'rgba(75, 192, 192, 0.2)',
                        'rgba(153, 102, 255, 0.2)',
                        'rgba(255, 159, 64, 0.2)'
                    ],
                    borderColor: [
                        'rgba(255,99,132,1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(75, 192, 192, 1)',
                        'rgba(153, 102, 255, 1)',
                        'rgba(255, 159, 64, 1)'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero: true
                        }
                    }]
                }
            }

        });

        this.profitSaleslineChart = new Chart(this.lineCanvas.nativeElement, {

            type: 'line',
            data: {
                labels: ['day1', 'day2', 'day3', 'day4', 'day5', 'day6', 'day7'],
                datasets: [
                    {
                        label: 'Profit',
                        fill: false,
                        lineTension: 0.1,
                        backgroundColor: 'rgba(74, 239, 79,0.4)',
                        borderColor: 'rgba(74, 239, 79,1)',
                        borderCapStyle: 'butt',
                        borderDash: [],
                        borderDashOffset: 0.0,
                        borderJoinStyle: 'miter',
                        pointBorderColor: 'rgba(75,192,192,1)',
                        pointBackgroundColor: '#fff',
                        pointBorderWidth: 1,
                        pointHoverRadius: 5,
                        pointHoverBackgroundColor: 'rgba(75,192,192,1)',
                        pointHoverBorderColor: 'rgba(220,220,220,1)',
                        pointHoverBorderWidth: 2,
                        pointRadius: 1,
                        pointHitRadius: 10,
                        data: [65, 59, 80, 81, 56, 55, 40],
                        spanGaps: false,
                    },
                    {
                        label: 'Sales',
                        fill: false,
                        lineTension: 0.1,
                        backgroundColor: 'rgba(75,192,192,0.4)',
                        borderColor: 'rgba(75,192,192,1)',
                        borderCapStyle: 'butt',
                        borderDash: [],
                        borderDashOffset: 0.0,
                        borderJoinStyle: 'miter',
                        pointBorderColor: 'rgba(75,192,192,1)',
                        pointBackgroundColor: '#fff',
                        pointBorderWidth: 1,
                        pointHoverRadius: 5,
                        pointHoverBackgroundColor: 'rgba(75,192,192,1)',
                        pointHoverBorderColor: 'rgba(220,220,220,1)',
                        pointHoverBorderWidth: 2,
                        pointRadius: 1,
                        pointHitRadius: 10,
                        data: [28, 48, 40, 19, 86, 27, 90],
                        spanGaps: false,
                    }
                ]
            }

        });

        this.purchaseSaleslineChart = new Chart(this.lineCanvas2.nativeElement, {
            type: 'line',
            data: {
                labels: ['day1', 'day2', 'day3', 'day4', 'day5', 'day6', 'day7'],
                datasets: [
                    {
                        label: 'Sales',
                        fill: false,
                        lineTension: 0.1,
                        backgroundColor: 'rgba(20, 53, 170,0.4)',
                        borderColor: 'rgba(20, 53, 170,1)',
                        borderCapStyle: 'butt',
                        borderDash: [],
                        borderDashOffset: 0.0,
                        borderJoinStyle: 'miter',
                        pointBorderColor: 'rgba(75,192,192,1)',
                        pointBackgroundColor: '#fff',
                        pointBorderWidth: 1,
                        pointHoverRadius: 5,
                        pointHoverBackgroundColor: 'rgba(75,192,192,1)',
                        pointHoverBorderColor: 'rgba(220,220,220,1)',
                        pointHoverBorderWidth: 2,
                        pointRadius: 1,
                        pointHitRadius: 10,
                        data: [this.saleValues],
                        spanGaps: false,
                    }
                ]
            }

        });

    }
}

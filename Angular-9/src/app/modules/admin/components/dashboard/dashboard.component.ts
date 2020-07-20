import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  public chart = {
    title: 'Leaves per month',
    type: 'BarChart',
    data: [['Half day', 8], ['Full Day', 10], ['Short Leaves', 20]],
    columnNames: ['Element', 'Number'],
    options: {
      animation: {
        duration: 250,
        easing: 'ease-in-out',
        startup: true
      }
    }
  };

  constructor() { }

  ngOnInit(): void {
  }

}

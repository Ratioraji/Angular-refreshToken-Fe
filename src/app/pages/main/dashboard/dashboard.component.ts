import { Component, ViewChild, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/services/auth.services';
import { DashboardService } from 'src/app/services/dashboard.services';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  errored: boolean;
  isLoading: boolean;
  emps: Array<any>;

  constructor(
    private authService: AuthenticationService,
    private dashboardService: DashboardService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.getEmployeeData();
  }
  logout() {
    this.authService.logout() ? this.router.navigate(['/auth/login']) : this.errored =  true;
  }
  getEmployeeData() {
      this.dashboardService.getEmployees().subscribe(
        (response: any) => {
          this.isLoading = false;
          this.emps = response;
        },
        (error: any) => {
          this.isLoading = false;
          console.log(error);
        }
      );
  }
}

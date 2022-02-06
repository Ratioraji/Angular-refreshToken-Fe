import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BaseService } from './base.service';
import { Observable, of } from 'rxjs';
import { Router } from '@angular/router';

const routes = {
  employee: '/employees',
};

@Injectable({
  providedIn: 'root'
})
export class DashboardService extends BaseService<any> {
  constructor(
    http: HttpClient,
  ) {
    super(http);
  }
  getEmployees() {
    return this.sendGet(this.baseUrl(`${routes.employee}`));
  }

}

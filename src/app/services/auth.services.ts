import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest } from '@angular/common/http';
import { BaseService } from './base.service';
import { Observable, of } from 'rxjs';
import { CredentialsService } from './credentials.service';
import { Router } from '@angular/router';

const routes = {
  login: '/login',
  refreshToken: '/token',
};
const defaultPageNo = 1;
const defaultPagSize = 10;

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService extends BaseService<any> {
  cachedRequests: Array<HttpRequest<any>> = [];

  constructor(
    http: HttpClient,
    private credentialsService: CredentialsService
  ) {
    super(http);
  }
  login(payload: any): Observable<any> {
    return this.sendNoAuthPost(this.baseUrl(`${routes.login}`), payload);
  }
  refreshToken(payload) {
    return this.sendPost(this.baseUrl(`${routes.refreshToken}`), payload);
  }
  logout(): Observable<boolean> {
    // Customize credentials invalidation here
    this.credentialsService.setCredentials();
    return of(true);
  }
}

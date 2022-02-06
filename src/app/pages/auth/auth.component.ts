import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/services/auth.services';
import { CredentialsService } from 'src/app/services/credentials.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'auth-comp',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent implements OnInit {
  title = 'refresh-task';
  isLoggedIn: boolean;
  constructor(
    private router: Router,
    private credentialService: CredentialsService
  ) {
    this.isLoggedIn = credentialService.isAuthenticated();
  }
  ngOnInit(): void {
    this.checkLoggedInStatus();
  }

  checkLoggedInStatus() {
    if (this.isLoggedIn) {
      this.router.navigate(['/dashboard']);
    }
  }
}

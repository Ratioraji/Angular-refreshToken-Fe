import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { CredentialsService } from 'src/app/services/credentials.service';
import { AuthenticationService } from '../../../services/auth.services';
interface Alert {
  type: string;
  message: string;
}
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  isLoading = false;
  loginForm: FormGroup;
  loginErrorMessage: string;
  loginError = false;

  constructor(
    private authService: AuthenticationService,
    private router: Router,
    private credentialService: CredentialsService,
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required,  Validators.email, Validators.minLength(4)]],
      password: ['', [Validators.required]]
    });
  }
  get email() {
    return this.loginForm.controls.email;
  }
  get password() {
    return this.loginForm.controls.password;
  }
  login() {
    console.log(this.email, this.password);
    if (this.email.invalid || this.password.invalid) {
      return;
    }
    this.isLoading = true;
    const { email, password } = this.loginForm.value;
    const login = this.authService.login({
      email: email.trim(),
      password: password.trim()
    });
    login.subscribe(
        response => {
          // this.setLoginState(response.status);
          console.log(response);
          if (response.status) {
            const data = {
              email: response.userId,
              token: response.accessToken,
              name: response.userId,
              refreshToken: response.refreshToken,
              tokenExpireTime: new Date(response.accessTokenExpiresUtc),
              refreshTokenExpireTime: new Date(response.accessTokenExpiresUtc),
            };

            this.credentialService.setCredentials(data);

            this.router.navigate(['/dashboard']);
            // this.router.navigate(["/dashboard/alpha"]);

          } else {
          this.loginError = true;
          this.loginErrorMessage = response.message;
          this.isLoading = false;
          }
        },
        error => {
          this.loginErrorMessage = error.message;
          this.loginError = true;
          this.isLoading = false;
        }
      );
  }
  setLoginState(): void {
  }

}


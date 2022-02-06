import { HttpRequest, HttpHandler, HttpInterceptor } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Subject, Observable, throwError } from 'rxjs';
import { catchError, switchMap, tap} from 'rxjs/operators';
import { AuthenticationService } from './auth.services';
import { CredentialsService } from './credentials.service';

@Injectable({
  providedIn: 'root'
})
export class TokenInterceptor implements HttpInterceptor {

    refreshTokenInProgress = false;

    tokenRefreshedSource = new Subject();
    tokenRefreshed$ = this.tokenRefreshedSource.asObservable();

    constructor(
      private router: Router,
      private credService: CredentialsService,
      private authService: AuthenticationService,
    ) {}

    applyAuthToHeader(request) {
        request = request.clone({
          setHeaders: {
            Authorization: `Bearer ${this.credService.credentials.token}`
          }
        });
        return request;
    }

    refreshToken(): Observable<any> {
        if (this.refreshTokenInProgress) {
            return new Observable(observer => {
                this.tokenRefreshed$.subscribe(() => {
                    observer.next();
                    observer.complete();
                });
            });
        } else {
            this.refreshTokenInProgress = true;

            return this.reAuthenticate().pipe(
                tap(() => {
                    this.refreshTokenInProgress = false;
                    this.tokenRefreshedSource.next();
                }),
                catchError((): any => {
                    this.refreshTokenInProgress = false;
                    this.logout();
                    return;
                }));
        }
    }

    logout() {
        this.authService.logout();
        this.router.navigate(['auth/login']);
    }

    handleResponseError(error, request?, next?) {
        if (error.status === 500) {
            return this.refreshToken().pipe(
                switchMap(() => {
                    request = this.applyAuthToHeader(request);
                    return next.handle(request);
                }),
                catchError(e => {
                    if (e.status !== 401) {
                        return this.handleResponseError(e);
                    } else {
                        this.logout();
                    }
                }));
        }
        return throwError(error);
    }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<any> {
      if (this.credService.credentials && this.credService.credentials.token) {
        // Handle request
        request = this.applyAuthToHeader(request);

        // Handle response
        return next.handle(request).pipe(catchError(error => {
            return this.handleResponseError(error, request, next);
        }));
      } else {
        return next.handle(request);
      }
    }

    reAuthenticate(): Observable <any> {
      let data;
      this.authService.refreshToken({refreshToken: this.credService.credentials.refreshToken}).subscribe(
        response => {
          console.log(response);
          if (response.status) {
            data = {
              email: response.userId,
              token: response.accessToken,
              name: response.userId,
              refreshToken: response.refreshToken,
              tokenExpireTime: new Date(response.accessTokenExpiresUtc),
              refreshTokenExpireTime: new Date(response.accessTokenExpiresUtc),
            };
            this.credService.setCredentials(data);
            return data;
          } else {
            console.log('error');
            return ;
          }
        },
          error => {
            console.log('error');
            return ;
          }
        );
      return data;
      }
}

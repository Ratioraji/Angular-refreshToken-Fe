import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router
} from '@angular/router';
import { CredentialsService } from '../../../services/credentials.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    public credentialsService: CredentialsService,
    public router: Router
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    if (this.credentialsService.isAuthenticated()) {
      console.log('got here' , this.credentialsService.isAuthenticated() );
      return true;
    }
    this.router.navigate(['/auth/login'], {
      queryParams: { redirect: state.url },
      replaceUrl: true
    });
    return false;
  }
}

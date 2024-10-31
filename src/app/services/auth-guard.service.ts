import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from './auth.service';


@Injectable({
  providedIn: 'root'
})
export class AuthGuardService {

  constructor(public auth: AuthService,
              public router: Router) { }

  canActivate(): boolean {
    if (!this.auth.isAuthenticated()) {
      this.auth.logout();
      this.router.navigate(['login']);
      return false;
    }
    return true;
  }
}

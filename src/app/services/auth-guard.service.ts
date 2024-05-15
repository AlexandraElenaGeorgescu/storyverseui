import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable()
export class AuthGuardService implements CanActivate {
    constructor(private router: Router) { }
    canActivate(): boolean {
        const jwtHelper = new JwtHelperService();
        var userToken = localStorage.getItem('user-token');
        if (userToken /*&& !jwtHelper.isTokenExpired(userToken)*/) {
            return true;
        } else {
            this.router.navigate(['user-signin']);
            return false;
        }
    }
}

import { Injectable } from '@angular/core';
import { AUTH_CONFIG } from './auth0-variables';
import { Router } from '@angular/router';
import * as auth0 from 'auth0-js';
import "rxjs/add/operator/toPromise";
import {BackendService} from "../backend.service";
import {Location} from "@angular/common";


@Injectable()
export class AuthService {
  auth0 = new auth0.WebAuth({
    clientID: AUTH_CONFIG.clientID,
    domain: AUTH_CONFIG.domain,
    responseType: 'token',
    audience: `magic-backend`,
    redirectUri: AUTH_CONFIG.callbackURL,
    scope: 'openid profile'
  });

  constructor(public router: Router, private location: Location, private backend: BackendService) {}

  public login(): void {
    this.auth0.authorize();
  }

  public handleAuthentication(): void {
    this.auth0.parseHash((err, authResult) => {
      if (authResult && authResult.accessToken) {
        window.location.hash = '';
        this.setSession(authResult);
        this.checkProfile(true);
      } else if (err) {
        this.router.navigate(['/my']);
        console.log(err);
        alert(`Authentication error: ${err.error}`);
      } else if (this.isAuthenticated()) {
        this.checkProfile(this.location.path().indexOf('callback') !== -1);
      } else if (this.location.path().indexOf('callback') !== -1) {
        this.router.navigate(['/my']);
      }
    });
  }

  private checkProfile(redirect: boolean): void {
    this.backend.getOwnProfile().then(profile => {
      if (profile === null) {
        this.router.navigate(['/pickUsername']);
      } else {
        localStorage.setItem('username', profile.username);
        if (redirect) {
          this.router.navigate(['/my']);
        }
      }
    });
  }

  private setSession(authResult): void {
    // Set the time that the access token will expire at
    const expiresAt = JSON.stringify((authResult.expiresIn * 1000) + new Date().getTime());
    localStorage.setItem('access_token', authResult.accessToken);
    localStorage.setItem('expires_at', expiresAt);
  }

  public logout(): void {
    // Remove tokens and expiry time from localStorage
    localStorage.removeItem('access_token');
    localStorage.removeItem('expires_at');
    // Go back to the home route
    this.router.navigate(['/']);
  }

  public isAuthenticated(): boolean {
    // Check whether the current time is past the
    // access token's expiry time
    const expiresAt = JSON.parse(localStorage.getItem('expires_at'));
    return new Date().getTime() < expiresAt;
  }

}

import { Component } from '@angular/core';
import {AuthService} from "./auth/auth.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styles: [`main {
    min-height: 2000px;
    margin-top: 70px;
  }`]
})
export class AppComponent {
  constructor(public auth: AuthService) {
    auth.handleAuthentication();
  }
}

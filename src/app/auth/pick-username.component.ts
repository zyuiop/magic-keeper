import {Component} from "@angular/core";
import {isUndefined} from "util";
import {BackendService} from "../backend.service";
import {Response} from "@angular/http";
import {Router} from "@angular/router";

@Component({
  selector: 'app-pick-username',
  templateUrl: './pick-username.component.html'
})
export class PickUsernameComponent {
  username: string;
  valid = false;
  error: string;
  sent = false;

  private _invalidError = "Invalid format. Required : 3 to 22 alphanumeric (or hyphens/underscores) characters";
  private _usedError = "This username is already taken";

  constructor(private backend: BackendService, private router: Router) {}

  private checkFormat(): boolean {
    return /^[a-zA-Z0-9_-]{3,22}$/.test(this.username);
  }

  check(): void {
    const valid = this.checkFormat();
    if (!valid) {
      this.error = this._invalidError;
      this.valid = false;
    } else {
      this.backend.getProfile(this.username).then(val => {
        if (val !== null) {
          this.valid = false;
          this.error = this._usedError;
        } else {
          this.valid = this.checkFormat(); // it might have changed since the request was made
        }
      }).catch(err => {
        this.valid = this.checkFormat();
      });
    }
  }

  accept(): void {
    if (this.checkFormat() && this.valid) {
      this.sent = true;
      // do request
      const name = this.username; // copy the name to avoid it changing during the request
      this.backend.updateProfile({username: name}).then(r => {
        this.router.navigate(['/']);
      }).catch(err => {
        this.sent = false;
        if (err instanceof Response && (err as Response).status === 400) {
          const text = (err as Response).text();
          if (text.indexOf("invalid") !== -1) {
            this.valid = false;
            this.error = this._invalidError;
            return;
          } else if (text.indexOf("already used") !== -1) {
            this.valid = false;
            this.error = this._usedError;
            return;
          }
        }

        this.valid = false;
        this.error = "An unknown error occured.";
      });
    }
  }

  getClass(): string {
    return "col-lg-8 form-group " + (this.hasErrors() ? "has-error has-feedback" : "");
  }

  hasErrors(): boolean {
    return !isUndefined(this.username) && !this.valid;
  }
}

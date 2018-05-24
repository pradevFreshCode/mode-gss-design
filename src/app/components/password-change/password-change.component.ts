import {Component, OnInit} from '@angular/core';
import {UserModel} from '../../modules/data-services/models/User.model';
import {SessionService} from '../../services/session.service';
import {UsersService} from '../../modules/data-services/services/usersService';
import {Router} from '@angular/router';

@Component({
  selector: 'app-password-change',
  templateUrl: './password-change.component.html'
})
export class PasswordChangeComponent implements OnInit {
  public currentUser: UserModel = null;
  public confirmationCode: string = null;
  public isLoading: boolean = false;
  public isEmailSending: boolean = false;
  public error: string = null;
  public emailToSend: string;
  public newPassword: string;

  public sendingResult: any;

  constructor(private _sessionService: SessionService,
              private _usersService: UsersService,
              private _router: Router) {
  }

  ngOnInit() {
    this._sessionService.CurrentUserReplaySubject.subscribe(user => {
      this.currentUser = user;
      if (this.currentUser.email) {
        this.emailToSend = this.currentUser.email;
        this.sendPasswordChangeEmail();
      }
    });
  }

  sendPasswordChangeEmail() {
    this.error = null;

    if (!this.emailToSend) {
      return;
    }
    this.isEmailSending = true;
    this._usersService.sendPasswordChangeEmail(this.emailToSend).subscribe(result => {
      this.sendingResult = result;
      this.isEmailSending = false;
    }, err => {
      this.error = 'Error occurred when sending confirmation email';
      this.isEmailSending = false;
    });
  }

  clearError() {
    this.error = null;
  }

  changePassword() {
    if (!this.confirmationCode || !this.currentUser || !this.emailToSend) {
      return;
    }

    this.isLoading = true;
    this._usersService.changePassword(this.emailToSend, this.confirmationCode, this.newPassword).subscribe(response => {
      this.isLoading = false;
      this._sessionService.reinitCurrentUser().subscribe(user => {
        this._router.navigate(['/auth/register-complete']);
      }, err => {
        this.error = 'Error occurred when updating user data';
      });
    }, err => {
      this.error = err || 'Error occurred when validate confirmation code';
      this.isLoading = false;
    });
  }
}

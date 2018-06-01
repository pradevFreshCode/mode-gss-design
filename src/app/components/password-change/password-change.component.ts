import {Component, OnInit} from '@angular/core';
import {UserModel} from '../../modules/data-services/models/User.model';
import {SessionService} from '../../services/session.service';
import {UsersService} from '../../modules/data-services/services/usersService';
import {Router} from '@angular/router';
import {UtilsPassword} from '../../Utils/utilsPassword';

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
  public login: string;
  public newPassword: string;
  public newPasswordConfirm: string;
  public isPasswordVisible: boolean = false;

  public passwordPattern = UtilsPassword.passwordPattern;
  public passwordValidationMessage = UtilsPassword.passwordValidationMessage;

  public sendingResult: any;

  constructor(private _sessionService: SessionService,
              private _usersService: UsersService,
              private _router: Router) {
  }

  ngOnInit() {
    this._sessionService.CurrentUserReplaySubject.subscribe(user => {
      this.currentUser = user;
      if (this.currentUser && this.currentUser.login) {
        this.login = this.currentUser.login;
        if (!this.sendingResult) {
          this.sendPasswordChangeEmail();
        }
      }
    });
  }

  sendPasswordChangeEmail() {
    this.error = null;

    if (!this.login) {
      return;
    }
    this.isEmailSending = true;
    this._usersService.sendPasswordChangeEmail(this.login).subscribe(result => {
      this.sendingResult = result;
      this.isEmailSending = false;
    }, err => {
      this.error = err;
      this.isEmailSending = false;
    });
  }

  clearError() {
    this.error = null;
  }

  changePassword() {
    if (!this.confirmationCode || !this.newPassword || !this.login) {
      return;
    }

    this.isLoading = true;
    this._usersService.changePassword(this.login, this.confirmationCode, this.newPassword).subscribe(response => {
      this.isLoading = false;
      this._sessionService.reinitCurrentUser().subscribe(user => {
        this._router.navigate(['/auth/password-changed']);
      }, err => {
        this.error = 'Error occurred when updating user data';
      });
    }, err => {
      this.error = err || 'Error occurred when validate confirmation code';
      this.isLoading = false;
    });
  }

  getPasswordInputType() {
    return this.isPasswordVisible ? 'text' : 'password';
  }
}

import {Component, OnInit} from '@angular/core';
import {UserModel} from '../../modules/data-services/models/User.model';
import {SessionService} from '../../services/session.service';
import {UsersService} from '../../modules/data-services/services/usersService';
import {Router} from '@angular/router';

@Component({
  selector: 'app-email-confirmation',
  templateUrl: './email-confirmation.component.html'
})
export class EmailConfirmationComponent implements OnInit {
  public currentUser: UserModel = null;
  public confirmationCode: string = null;
  public isLoading: boolean = false;
  public isEmailSending: boolean = false;
  public error: string = null;

  constructor(private _sessionService: SessionService,
              private _usersService: UsersService,
              private _router: Router) {
  }

  ngOnInit() {
    this._sessionService.CurrentUserReplaySubject.subscribe(user => {
      this.currentUser = user;
      this.sendConfirmationEmail();
    });
  }

  sendConfirmationEmail() {
    this.error = null;

    if (!this.currentUser) {
      return;
    }
    this.isEmailSending = true;
    this._usersService.sendConfirmationEmail(this.currentUser._id).subscribe(() => {
      this.isEmailSending = false;
    }, err => {
      this.error = 'Error occurred when sending confirmation email';
      this.isEmailSending = false;
    });
  }

  confirmEmail() {
    if (!this.confirmationCode || !this.currentUser) {
      return;
    }

    this.isLoading = true;
    this._usersService.confirmEmail(this.currentUser._id, this.confirmationCode).subscribe(response => {
      this.isLoading = false;
      this._router.navigate(['/auth/register-complete']);
    }, err => {
      this.error = 'Error occurred when validate confirmation code';
      this.isLoading = false;
    });
  }
}

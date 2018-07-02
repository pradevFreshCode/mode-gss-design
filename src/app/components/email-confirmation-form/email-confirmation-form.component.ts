import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {Router} from '@angular/router';
import {UserModel} from '../../modules/data-services/models/User.model';
import {UsersService} from '../../modules/data-services/services/usersService';
import {SessionService} from '../../services/session.service';

@Component({
  selector: 'app-email-confirmation-form',
  templateUrl: './email-confirmation-form.component.html'
})
export class EmailConfirmationFormComponent implements OnInit {
  public currentUser: UserModel = null;
  public confirmationCode: string = null;
  public isLoading: boolean = false;
  public isEmailSending: boolean = false;
  public error: string = null;

  public sendingResult: any;

  @Output() confirmEmailApiRespondSuccess = new EventEmitter<any>();
  @Output() confirmEmailApiRespondError = new EventEmitter<any>();
  @Output() loadingStateChanged = new EventEmitter<boolean>();

  constructor(private _sessionService: SessionService,
              private _usersService: UsersService,
              private _router: Router) {
  }

  ngOnInit() {
    this.loadingStateChanged.subscribe(newState => {
      this.isLoading = newState;
    });

    this._sessionService.CurrentUserReplaySubject.subscribe(user => {
      this.currentUser = user;
      if (!this.sendingResult) {
        this.sendConfirmationEmail();
      }
    });
  }

  sendConfirmationEmail() {
    this.error = null;

    if (!this.currentUser) {
      return;
    }
    this.isEmailSending = true;
    this._usersService.sendConfirmationEmail(this.currentUser._id).subscribe(result => {
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

  confirmEmail() {
    if (!this.confirmationCode || !this.currentUser) {
      return;
    }

    this.loadingStateChanged.emit(true);
    this._usersService.confirmEmail(this.currentUser._id, this.confirmationCode).subscribe(response => {
      this.confirmEmailApiRespondSuccess.emit(response);
      this.loadingStateChanged.emit(false);
    }, err => {
      this.confirmEmailApiRespondError.emit(err);
      this.error = err || 'Error occurred when validate confirmation code';
      this.loadingStateChanged.emit(false);
    });
  }
}

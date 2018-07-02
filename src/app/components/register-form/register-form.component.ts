import {Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {UtilsPassword} from '../../Utils/utilsPassword';
import {RegistrationModel} from '../../models/registration.model';
import {NgForm} from '@angular/forms';
import {UtilsMasks} from '../../Utils/utilsMasks';
import {SessionService} from '../../services/session.service';
import {UtilsString} from '../../Utils/utilsStrings';
import {UserModel} from '../../modules/data-services/models/User.model';

@Component({
  selector: 'app-register-form',
  templateUrl: './register-form.component.html'
})
export class RegisterFormComponent implements OnInit {
  @Input() showAdditionalLinks: boolean = true;
  @Input() formTitle: string = "Register";
  @Input() submitButtonDisabled: boolean = false;
  @Output() registerApiRespondedSuccess = new EventEmitter<UserModel>();
  @Output() registerApiRespondedError = new EventEmitter<any>();
  @Output() loadingStateChanged = new EventEmitter<boolean>();

  phoneMask = UtilsMasks.GetPhoneMask();
  emailMask = UtilsMasks.GetEmailMask();
  model: RegistrationModel = new RegistrationModel();
  passwordPattern = UtilsPassword.passwordPattern;
  passwordValidationMessage = UtilsPassword.passwordValidationMessage;
  error: string;
  isLoading: boolean;

  isPasswordVisible: boolean = false;
  @ViewChild('phoneInput') phoneInput: ElementRef;
  @ViewChild('registerForm') public registerForm: NgForm;


  constructor(public _sessionService: SessionService,
              private router: Router) {
  }

  ngOnInit() {
    this.loadingStateChanged.subscribe(newState => {
      this.isLoading = newState;
    });
  }

  onSubmit() {
    this.error = null;
    this.loadingStateChanged.emit(true);

    this._sessionService.register(this.model).subscribe(result => {
      this.registerApiRespondedSuccess.emit(result);
      this.loadingStateChanged.emit(false);
      if (!result) {
        this.error = 'Error occurred when try to register';
      }
    }, err => {
      this.registerApiRespondedError.emit(err);
      this.error = UtilsString.ParseResponseErrorMessage(err);
      this.loadingStateChanged.emit(false);
    });
  }

  getPasswordInputType() {
    return this.isPasswordVisible ? 'text' : 'password';
  }
}

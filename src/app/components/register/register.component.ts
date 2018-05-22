import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {NgForm} from '@angular/forms';
import {UtilsMasks} from '../../Utils/utilsMasks';
import {RegistrationModel} from '../../models/registration.model';
import {SessionService} from '../../services/session.service';
import {UtilsPassword} from '../../Utils/utilsPassword';
import {UtilsString} from '../../Utils/utilsStrings';

@Component({
  selector: 'app-register',
  templateUrl: 'register.component.html'
})
export class RegisterComponent implements OnInit {
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
    if (this._sessionService.Token) {
      this.router.navigate(['/']);
    }
  }

  onSubmit() {
    this.error = null;
    this.isLoading = true;

    this._sessionService.register(this.model).subscribe(result => {
      if (result) {
        this.router.navigate(['/auth/email-confirmation']);
      } else {
        this.error = 'Error occurred when try to register';
        this.isLoading = false;
      }
    }, err => {
      this.error = UtilsString.ParseResponseErrorMessage(err);
      this.isLoading = false;
    });
  }

  getPasswordInputType() {
    return this.isPasswordVisible ? 'text' : 'password';
  }
}

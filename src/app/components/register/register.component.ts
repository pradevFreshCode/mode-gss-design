import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {SessionService} from '../../services/session.service';

@Component({
  selector: 'app-register',
  templateUrl: 'register.component.html'
})
export class RegisterComponent implements OnInit {
  constructor(public _sessionService: SessionService,
              private router: Router) {
  }

  ngOnInit() {
    if (this._sessionService.Token) {
      this.router.navigate(['/']);
    }
  }

  onRegisterApiRespondedSuccess(resultUser) {
    if (resultUser) {
      this.router.navigate(['/auth/email-confirmation']);
    }
  }
}

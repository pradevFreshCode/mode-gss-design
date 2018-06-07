import {Component} from '@angular/core';
import {SessionService} from '../../services/session.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-register-success',
  templateUrl: 'register-success.component.html'
})
export class RegisterSuccessComponent {
  constructor(private _sessionService: SessionService,
              private router: Router) {
  }

  continueClicked() {
    if (this._sessionService.CloseTabAfterSignIn) {
      window.close();
    } else {
      this.router.navigate(['/']);
    }
  }
}

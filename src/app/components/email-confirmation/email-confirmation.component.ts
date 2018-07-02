import {Component} from '@angular/core';
import {SessionService} from '../../services/session.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-email-confirmation',
  templateUrl: './email-confirmation.component.html'
})
export class EmailConfirmationComponent {
  constructor(private _sessionService: SessionService,
              private _router: Router) {
  }

  onConfirmEmailApiRespondSuccess(result) {
    this._sessionService.reinitCurrentUser().subscribe(user => {
      this._router.navigate(['/auth/register-complete']);
    });
  }
}

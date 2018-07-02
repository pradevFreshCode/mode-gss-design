import {Component} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {SessionService} from '../../services/session.service';

@Component({
  selector: 'app-login',
  templateUrl: 'login.component.html'
})
export class LoginComponent {
  constructor(private sessionService: SessionService,
              private router: Router,
              private route: ActivatedRoute) {
    if (!!this.sessionService.Token) {
      this.router.navigate(['/']);
    }

    this.route.queryParams.subscribe(queryParams => {
      if (queryParams['closeAfterSignIn']) {
        this.sessionService.CloseTabAfterSignIn = queryParams['closeAfterSignIn'];
      }
    });
  }

  onLoginApiRespondedSuccess(resultUser) {
    if (resultUser) {
      if (this.sessionService.CloseTabAfterSignIn) {
        window.close();
      } else {
        this.router.navigate(['/']);
      }
    }
  }
}

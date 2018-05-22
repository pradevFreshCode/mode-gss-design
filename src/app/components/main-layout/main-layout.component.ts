import {Component, OnInit} from '@angular/core';
import {UserModel} from '../../modules/data-services/models/User.model';
import {SessionService} from '../../services/session.service';

@Component({
  selector: 'app-main-layout',
  templateUrl: './main-layout.component.html'
})
export class MainLayoutComponent implements OnInit {
  logopath = '../../../assets/logo_returnit.png';

  public currentUser: UserModel = null;

  constructor(private _sessionService: SessionService) {
    this._sessionService.CurrentUserReplaySubject.subscribe(user => {
      this.currentUser = user;
    });
  }

  ngOnInit() {
  }

  logout() {
    this._sessionService.logout().subscribe(() => {
      console.log('logged out');
    }, err => {
      console.log('error ocurred when logout');
    });
  }
}

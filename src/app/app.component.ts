import {Component} from '@angular/core';
import {environment} from '../environments/environment';
import {UsersService} from './modules/data-services/services/usersService';
import {SessionService} from './services/session.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';
  logopath = environment.assets_dir + 'logo_returnit.png';

  constructor(private _sessionService: SessionService, private _usersService: UsersService) {
  }

  performLogin() {
    this._sessionService.login('admin', 'admin').subscribe(() => {
      console.log('logged in');
    });
  }

  getUsers() {
    this._usersService.getAll().subscribe(users => {
      console.log('users', users);
    });
  }
}

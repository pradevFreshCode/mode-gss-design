import {Component, OnInit} from '@angular/core';
import {UsersService} from '../../modules/data-services/services/usersService';
import * as _ from 'lodash';
import {UserModel} from '../../modules/data-services/models/User.model';
import {UserRoleModel} from '../../modules/data-services/models/UserRole.model';
import {AccessService} from '../../services/access.service';
import {SessionService} from '../../services/session.service';
import {UserRolesService} from '../../modules/data-services/services/userRolesService';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html'
})
export class UsersComponent implements OnInit {
  usersList: UserModel[] = [];
  availableRoles: UserRoleModel[] = [];
  isSuperuser: boolean = false;

  constructor(private _usersService: UsersService,
              private _accessService: AccessService,
              private _sessionService: SessionService,
              private _usersRolesService: UserRolesService) {
    this.isSuperuser = this._accessService.IsAdmin();
  }

  ngOnInit() {
    this._usersRolesService.getAll().subscribe(roles => {
      this.availableRoles = roles;
    });

    this._usersService.getAll().subscribe(users => {
      // let currentUser = this._sessionService.getCurrentUser();
      this.usersList = users.map(u => {
        return u;
      });
      console.log(this.usersList);
    });
  }

  removeUser(id: string) {
    this._usersService.deleteById(id).subscribe(() => {
      this.usersList = this.usersList.filter(i => i._id !== id);
    });
  }

  saveUser(id: string) {
    const userEntry = _.find(this.usersList, u => u._id === id);

    if (!userEntry) {
      return;
    }

    this._usersService.update(userEntry).subscribe(user => {
      _.merge(userEntry, user);
    });
  }
}

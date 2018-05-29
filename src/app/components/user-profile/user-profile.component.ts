import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import * as _ from 'lodash';
import {UtilsMasks} from '../../Utils/utilsMasks';
import {UserModel} from '../../modules/data-services/models/User.model';
import {UserRoleModel} from '../../modules/data-services/models/UserRole.model';
import {SessionService} from '../../services/session.service';
import {AccessService} from '../../services/access.service';
import {UserRolesService} from '../../modules/data-services/services/userRolesService';
import {UsersService} from '../../modules/data-services/services/usersService';
import {UtilsString} from '../../Utils/utilsStrings';
import {UtilsPassword} from '../../Utils/utilsPassword';

@Component({
  selector: 'app-user-profile',
  templateUrl: 'user-profile.component.html'
})
export class UserProfileComponent implements OnInit {
  public phoneMask = UtilsMasks.GetPhoneMask();
  public emailMask = UtilsMasks.GetEmailMask();
  public model: UserModel;
  error: string;
  passwordConfirmation: string = null;
  isPasswordVisible: boolean = false;
  isLoading: boolean;
  isSuperuser: boolean = false;
  availableRoles: UserRoleModel[] = [];
  passwordPattern = UtilsPassword.passwordPattern;
  passwordValidationMessage = UtilsPassword.passwordValidationMessage;

  constructor(private _sessionService: SessionService,
              private _usersService: UsersService,
              private _accessService: AccessService,
              private _userRolesService: UserRolesService,
              private route: ActivatedRoute) {
    this._sessionService.CurrentUserReplaySubject.subscribe(() => {
      this.isSuperuser = this._accessService.IsAdmin();
    });
  }

  ngOnInit(): void {
    this._userRolesService.getAll().subscribe(roles => {
      this.availableRoles = roles;
    });

    this.route.params.subscribe(params => {
        if (params['id'] === 'self') {
          this.model = this._sessionService.CurrentUser;
        } else if (params['id'] === 'new') {
          this.model = new UserModel();
        } else {
          this._usersService.getById(params['id']).subscribe(user => {
            this.model = user;
          });
        }
      }
    );
  }

  onSubmit() {
    this.error = null;
    this.isLoading = true;

    let saveCommand = null;
    if (!!this.model._id) {
      saveCommand = this._usersService.update(this.model);
    } else {
      saveCommand = this._usersService.create(this.model);
    }

    saveCommand.subscribe(result => {
      _.merge(this.model, result);
      this.isLoading = false;
    }, err => {
      this.error = UtilsString.ParseResponseErrorMessage(err);
      this.isLoading = false;
    });
  }

  getPasswordInputType() {
    return this.isPasswordVisible ? 'text' : 'password';
  }
}

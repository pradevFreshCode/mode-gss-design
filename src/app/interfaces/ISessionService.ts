import {EventEmitter} from '@angular/core';
import {UserModel} from '../modules/data-services/models/User.model';
import {ReplaySubject} from 'rxjs/ReplaySubject';

export interface ISessionService {
    Token: string;

  TokenReplaySubject: ReplaySubject<string>;

    CurrentUserReplaySubject: ReplaySubject<UserModel>;

    CurrentUser: UserModel;

    login(login: string, password: string);

    logout();

    reinitCurrentUser();
}

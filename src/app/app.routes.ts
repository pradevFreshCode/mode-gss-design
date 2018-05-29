import {RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';
import {PageNotFoundComponent} from './components/page-not-found/page-not-found.component';
import {GssFormComponent} from './components/gss-form/gss-form.component';
import {MainLayoutComponent} from './components/main-layout/main-layout.component';
import {LoginComponent} from './components/login/login.component';
import {RegisterComponent} from './components/register/register.component';
import {UnauthorizedGuard} from './guards/unauthorized.guard';
import {AuthorizedGuard} from './guards/authorized.guard';
import {EmailConfirmationComponent} from './components/email-confirmation/email-confirmation.component';
import {UnconfirmedAccountGuard} from './guards/unconfirmed-account.guard';
import {RegisterSuccessComponent} from './components/register-success/register-success.component';
import {ConfirmedAccountGuard} from './guards/confirmed-account.guard';
import {ProcessedShipmentsComponent} from './components/processed-shipments/processed-shipments.component';
import {NotConfirmedComponent} from './components/not-confirmed/not-confirmed.component';
import {PasswordChangeComponent} from './components/password-change/password-change.component';
import {PasswordChangedComponent} from './components/password-changed/password-changed.component';
import {UsersComponent} from './components/users/users.component';
import {UserProfileComponent} from './components/user-profile/user-profile.component';
import {AdminGuard} from './guards/admin.guard';

export const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    data: {title: 'Return It'},
    children: [
      {
        path: '',
        component: GssFormComponent,
        data: {title: 'Return It'}
      },
      {
        path: 'processed-shipments',
        component: ProcessedShipmentsComponent,
        data: {title: 'Return It | Processed shipments'},
        canActivate: [ConfirmedAccountGuard]
      },
      {
        path: 'users',
        children: [
          {
            path: 'list',
            component: UsersComponent,
            canActivate: [AdminGuard],
            data: {title: 'Return It | Users'}
          },
          {
            path: ':id',
            component: UserProfileComponent,
            data: {title: 'Return It | Profile'}
          }
        ]
      },
      {
        path: 'not-confirmed',
        component: NotConfirmedComponent,
        data: {title: 'Page not found | Account not confirmed'}
      },
    ]
  },
  {
    path: 'auth',
    data: {title: 'Return It | Authorization'},
    children: [
      {path: '', redirectTo: 'login', pathMatch: 'full'},
      {
        path: 'login',
        component: LoginComponent,
        data: {title: 'Return It | Sign In'},
        canActivate: [UnauthorizedGuard]
      },
      {
        path: 'register',
        component: RegisterComponent,
        data: {title: 'Return It | Registration'},
        canActivate: [UnauthorizedGuard]
      },
      {
        path: 'email-confirmation',
        component: EmailConfirmationComponent,
        data: {title: 'Return It | Email confirmation'},
        canActivate: [UnconfirmedAccountGuard]
      },
      {
        path: 'register-complete',
        component: RegisterSuccessComponent,
        data: {title: 'Return It | Registration succeed'},
        canActivate: [ConfirmedAccountGuard]
      },
      {
        path: 'change-password',
        component: PasswordChangeComponent,
        data: {title: 'Return It | Password change'}
      },
      {
        path: 'password-changed',
        component: PasswordChangedComponent,
        data: {title: 'Return It | Password Successfully changed'}
      }
    ]
  },
  {
    path: '**',
    component: PageNotFoundComponent,
    data: {title: 'Page not found | Return It'}
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}

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
        // canActivate: [ConfirmedAccountGuard]
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

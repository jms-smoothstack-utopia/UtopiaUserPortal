import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from './layout/layout.component';
import { UserprofileComponent } from './layout/userprofile/userprofile.component';
import { CreateAccountComponent } from './account/create-account/create-account.component';
import { ValidateemailComponent } from './account/validateemail/validateemail.component';
import { LoginComponent } from './login/login.component';
import { LoginFormComponent } from './login/login-form/login-form.component';
import { PasswordConfirmationComponent } from './login/password-reset/password-confirmation/password-confirmation.component';
import { PasswordResetComponent } from './login/password-reset/password-reset.component';
import PathConstants from '../environments/paths';

const routes: Routes = [
  {
    path: PathConstants.LOGIN,
    component: LoginComponent,
    children: [
      {
        path: '',
        component: LoginFormComponent,
        pathMatch: 'full',
      },
      {
        path: 'forgotpassword',
        component: PasswordResetComponent,
      },
      {
        path: 'forgotpassword/checkemail',
        component: PasswordConfirmationComponent,
      },
      {
        path: 'accountmaker/confirmemail',
        component: ValidateemailComponent,
      },
    ],
  },
  {
    path: PathConstants.CREATE_ACCOUNT,
    component: CreateAccountComponent,
  },
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: PathConstants.USER_PROFILE,
        component: UserprofileComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}

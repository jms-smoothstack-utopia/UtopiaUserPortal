import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
<<<<<<< HEAD
import { UserProfileComponent } from './user-profile/user-profile.component';
import { HomeComponent } from './home/home.component';

const routes: Routes = [
  { path: '', component: HomeComponent, pathMatch: 'full'},
  { path: 'users/profile/:id', component: UserProfileComponent },
=======
import { LayoutComponent } from './layout/layout.component';
import { UserprofileComponent } from './layout/userprofile/userprofile.component';
import { AccountComponent } from './login/account/account.component';
import { ValidateemailComponent } from './login/account/validateemail/validateemail.component';
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
        path: 'accountmaker',
        component: AccountComponent,
      },
      {
        path: 'accountmaker/confirmemail',
        component: ValidateemailComponent,
      },
    ],
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
>>>>>>> dec89a5bb7c5aaf7135d4aec99a760eb7b3112ee
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}

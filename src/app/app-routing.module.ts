import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from './layout/layout.component';
import { UserprofileComponent } from './layout/userprofile/userprofile.component';
import { AccountComponent } from './login/account/account.component';
import { ValidateemailComponent } from './login/account/validateemail/validateemail.component';
import { LoginComponent } from './login/login.component';
import { MainPageComponent } from './login/main-page/main-page.component';
import { PasswordConfirmationComponent } from './login/password-reset/password-confirmation/password-confirmation.component';
import { PasswordResetComponent } from './login/password-reset/password-reset.component';
import { ResetformComponent } from './login/resetform/resetform.component';

const routes: Routes = [
  {
    path: "login",
    component: LoginComponent,
    children:
    [
      {
        path:"",
        component:MainPageComponent,
        pathMatch: "full"
      },
      {
        path:"forgotpassword",
        component:PasswordResetComponent,
      },
      {
        path:"forgotpassword/checkemail",
        component:PasswordConfirmationComponent,
      },
      {
        path:"accountmaker",
        component:AccountComponent,
      },
      {
        path:"accountmaker/confirmemail",
        component: ValidateemailComponent,
      },      
      {
        path:"password/resetform/:token",
        component: ResetformComponent,
      }
    ]
  },
  {
    path: "",
    component:LayoutComponent,
    children:
    [
      {
        path:"myprofile",
        component:UserprofileComponent,
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

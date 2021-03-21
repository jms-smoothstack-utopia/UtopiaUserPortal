import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from './layout/layout.component';
import { CreateAccountComponent } from './account/create-account/create-account.component';
import { ValidateemailComponent } from './account/validateemail/validateemail.component';
import { LoginComponent } from './login/login.component';
import { LoginFormComponent } from './login/login-form/login-form.component';
import { PasswordConfirmationComponent } from './login/password-reset/password-confirmation/password-confirmation.component';
import { PasswordResetComponent } from './login/password-reset/password-reset.component';
import { ResetformComponent } from './login/resetform/resetform.component';
import PathConstants from '../environments/paths';
import { ConfirmationComponent } from './login/resetform/confirmation/confirmation.component';
import { NotfoundComponent } from './notfound/notfound.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { ConfirmRegistrationComponent } from './account/confirm-registration/confirm-registration.component';
import { HomeComponent } from './home/home.component';
import { FlightsearchComponent } from './flightsearch/flightsearch.component';
import { UserFlightHistoryComponent } from './user-flight-history/user-flight-history.component';
import { UserFlightUpcomingComponent } from './user-flight-upcoming/user-flight-upcoming.component';
import { DeleteAccountComponent } from './account/delete-account/delete-account.component';
import { PerformDeletionComponent } from './account/perform-deletion/perform-deletion.component';
import { TicketDetailComponent } from './ticket-detail/ticket-detail.component';
import { ShoppingcartComponent } from './shoppingcart/shoppingcart.component';

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
      {
        path: 'password/resetform/:token',
        component: ResetformComponent,
      },
      {
        path: 'password/confirmationchange',
        component: ConfirmationComponent,
      },
    ],
  },
  {
    path: PathConstants.CREATE_ACCOUNT,
    component: CreateAccountComponent,
  },
  {
    path: PathConstants.PERFORM_DELETE_ACCOUNT,
    component: PerformDeletionComponent,
  },
  {
    path: PathConstants.DELETE_ACCOUNT,
    component: DeleteAccountComponent,
  },
  {
    path: PathConstants.CONFIRM_REGISTRATION + '/:confirmationTokenId',
    component: ConfirmRegistrationComponent,
  },
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: '',
        component: HomeComponent,
      },
      {
        path: 'myprofile/:id',
        component: UserProfileComponent,
      },
      {
        path: 'flight-search',
        component: FlightsearchComponent,
      },
      {
        path: 'shopping-cart',
        component: ShoppingcartComponent,
      },
      {
        path: PathConstants.USER_PROFILE,
        component: UserProfileComponent,
      },
      {
        path: PathConstants.FLIGHT_HISTORY,
        component: UserFlightHistoryComponent,
      },
      {
        path: PathConstants.FLIGHT_UPCOMING,
        component: UserFlightUpcomingComponent,
      },
      {
        path: PathConstants.TICKET_DETAIL,
        component: TicketDetailComponent,
      },
    ],
  },
  { path: '404/notfound', component: NotfoundComponent },
  { path: '**', redirectTo: '404/notfound' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}

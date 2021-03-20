import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { LoginComponent } from './login/login.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoginFormComponent } from './login/login-form/login-form.component';
import { PasswordResetComponent } from './login/password-reset/password-reset.component';
import { PasswordConfirmationComponent } from './login/password-reset/password-confirmation/password-confirmation.component';
import { CreateAccountComponent } from './account/create-account/create-account.component';
import { ValidateemailComponent } from './account/validateemail/validateemail.component';
import { LayoutComponent } from './layout/layout.component';
import { HeaderComponent } from './layout/header/header.component';
import { RouterModule } from '@angular/router';
import { SidebarComponent } from './layout/sidebar/sidebar.component';
import { ResetformComponent } from './login/resetform/resetform.component';
import { AuthInterceptor } from './services/auth/auth.interceptor';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { AlertComponent } from './shared/alert/alert.component';
import { LoadingSpinnerComponent } from './shared/loading-spinner/loading-spinner.component';
import { environment } from '../environments/environment';
import { LoggerModule } from 'ngx-logger';
import { ConfirmationComponent } from './login/resetform/confirmation/confirmation.component';
import { NotfoundComponent } from './notfound/notfound.component';
import { BlankComponent } from './blank/blank.component';
import { DpDatePickerModule } from 'ng2-date-picker';
import { ConfirmRegistrationComponent } from './account/confirm-registration/confirm-registration.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { HomeComponent } from './home/home.component';
import { ClickAwayDirective } from './shared/directives/click-away.directive';
import { FlightsearchComponent } from './flightsearch/flightsearch.component';
import { SearchboxComponent } from './searchbox/searchbox.component';
import { DatePipe } from '@angular/common';
import { ReturnalertComponent } from './shared/returnalert/returnalert.component';
import { UserFlightHistoryComponent } from './user-flight-history/user-flight-history.component';
import { UserFlightUpcomingComponent } from './user-flight-upcoming/user-flight-upcoming.component';
import { UserNavbarComponent } from './user-navbar/user-navbar.component';
import { PerformDeletionComponent } from './account/perform-deletion/perform-deletion.component';
import { DeleteAccountComponent } from './account/delete-account/delete-account.component';
import { TicketDetailComponent } from './ticket-detail/ticket-detail.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    LoginFormComponent,
    PasswordResetComponent,
    PasswordConfirmationComponent,
    CreateAccountComponent,
    ValidateemailComponent,
    LayoutComponent,
    HeaderComponent,
    SidebarComponent,
    ResetformComponent,
    AlertComponent,
    LoadingSpinnerComponent,
    ConfirmationComponent,
    NotfoundComponent,
    BlankComponent,
    AlertComponent,
    LoadingSpinnerComponent,
    UserProfileComponent,
    ConfirmRegistrationComponent,
    ClickAwayDirective,
    FlightsearchComponent,
    SearchboxComponent,
    ReturnalertComponent,
    UserFlightHistoryComponent,
    UserFlightUpcomingComponent,
    UserNavbarComponent,
    PerformDeletionComponent,
    DeleteAccountComponent,
    TicketDetailComponent,
  ],
  imports: [
    BrowserModule,
    RouterModule,
    AppRoutingModule,
    RouterModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    LoggerModule.forRoot({ level: environment.logLevel }),
    DpDatePickerModule,
    NgbModule,
  ],
  exports: [ClickAwayDirective],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    DatePipe,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}

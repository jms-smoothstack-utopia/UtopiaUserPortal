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
import { UserFlightHistoryComponent } from './user-flight-history/user-flight-history.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
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
    UserFlightHistoryComponent,
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

  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}

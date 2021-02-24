import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
<<<<<<< HEAD
import { UserProfileComponent } from './user-profile/user-profile.component';
import { HomeComponent } from './home/home.component';
=======
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { LoginComponent } from './login/login.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoginFormComponent } from './login/login-form/login-form.component';
import { PasswordResetComponent } from './login/password-reset/password-reset.component';
import { PasswordConfirmationComponent } from './login/password-reset/password-confirmation/password-confirmation.component';
import { AccountComponent } from './login/account/account.component';
import { ValidateemailComponent } from './login/account/validateemail/validateemail.component';
import { LayoutComponent } from './layout/layout.component';
import { HeaderComponent } from './layout/header/header.component';
import { RouterModule } from '@angular/router';
import { SidebarComponent } from './layout/sidebar/sidebar.component';
import { UserprofileComponent } from './layout/userprofile/userprofile.component';
import { AuthInterceptor } from './services/auth/auth.interceptor';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { AlertComponent } from './shared/alert/alert.component';
import { LoadingSpinnerComponent } from './shared/loading-spinner/loading-spinner.component';
import { environment } from '../environments/environment';
import { LoggerModule } from 'ngx-logger';
>>>>>>> dec89a5bb7c5aaf7135d4aec99a760eb7b3112ee

@NgModule({
  declarations: [
    AppComponent,
<<<<<<< HEAD
    UserProfileComponent,
    HomeComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
=======
    LoginComponent,

    LoginFormComponent,
    PasswordResetComponent,
    PasswordConfirmationComponent,
    AccountComponent,
    ValidateemailComponent,
    LayoutComponent,
    HeaderComponent,
    SidebarComponent,
    UserprofileComponent,
    AlertComponent,
    LoadingSpinnerComponent,
  ],
  imports: [
    BrowserModule,
    RouterModule,
    AppRoutingModule,
    NgbModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    LoggerModule.forRoot({ level: environment.logLevel }),
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
>>>>>>> dec89a5bb7c5aaf7135d4aec99a760eb7b3112ee
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}

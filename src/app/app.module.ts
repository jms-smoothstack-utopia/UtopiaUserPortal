import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { LoginComponent } from './login/login.component';
import { HeaderComponent } from './login/header/header.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MainPageComponent } from './login/main-page/main-page.component';
import { PasswordResetComponent } from './login/password-reset/password-reset.component';
import { PasswordConfirmationComponent } from './login/password-reset/password-confirmation/password-confirmation.component';
import { AccountComponent } from './login/account/account.component';
import { ValidateemailComponent } from './login/account/validateemail/validateemail.component';
import { LayoutComponent } from './layout/layout.component';
import { MainheaderComponent } from './layout/mainheader/mainheader.component';
import { RouterModule } from '@angular/router';
import { SidebarComponent } from './layout/sidebar/sidebar.component';
import { UserprofileComponent } from './layout/userprofile/userprofile.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HeaderComponent,
    MainPageComponent,
    PasswordResetComponent,
    PasswordConfirmationComponent,
    AccountComponent,
    ValidateemailComponent,
    LayoutComponent,
    MainheaderComponent,
    SidebarComponent,
    UserprofileComponent,
  ],
  imports: [
    BrowserModule,
    RouterModule,
    AppRoutingModule,
    NgbModule,
    ReactiveFormsModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

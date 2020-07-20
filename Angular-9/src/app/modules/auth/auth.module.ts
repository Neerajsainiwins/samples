import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthRoutingModule } from './auth-routing.module';
import { LoginComponent } from './login/login.component';
import { ForgotPasswordComponent } from './forgot-password/forgotpassword.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { LayoutComponent } from './layout/layout.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { RegisteredComponent } from './registered/registered.component';


@NgModule({
  declarations: [
    LoginComponent, 
    ForgotPasswordComponent, 
    SignUpComponent, LayoutComponent, 
    ResetPasswordComponent,
    RegisteredComponent],

  imports: [
    CommonModule,
    AuthRoutingModule,
    SharedModule
  ]
})
export class AuthModule { }

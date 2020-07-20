import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { ForgotPasswordComponent } from './forgot-password/forgotpassword.component';
import { LayoutComponent } from '../auth/layout/layout.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { RegisteredComponent } from './registered/registered.component';


const routes: Routes = [
  {
    path: "",
    component: LayoutComponent,
    children: [
      {
        path: "",
        redirectTo: "login",
        pathMatch: "full"
      },
      {
        path: "register",
        component: RegisteredComponent
      },
      {
        path: "login",
        component: LoginComponent
      },
      {
        path: "forgot-password",
        component: ForgotPasswordComponent
      },
      {
        path: "reset-password",
        component: ResetPasswordComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule { }

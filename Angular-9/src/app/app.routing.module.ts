import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';
// import { ErrorComponent } from './shared/error/error/error.component';

const AppRoutes: Routes = [
  {
  path: "",
    redirectTo: "",
    pathMatch: "full"
  },
  {
    path: "",
    loadChildren: () => import(`./modules/auth/auth.module`).then(m => m.AuthModule)
  },
  {
    path: "admin",
    loadChildren: () => import(`./modules/admin/admin.module`).then(m => m.AdminModule),
    // canActivate: [AuthGuard]
  },
  // {
  //   path: "404",
  //   component: ErrorComponent
  // },
  // {
  //   path: "**",
  //   component: ErrorComponent
  // },

  // {
  //   path: "error",
  //   component: ErrorComponent
  // }
];

@NgModule({
  imports:
    [
      RouterModule.forRoot(AppRoutes)
    ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
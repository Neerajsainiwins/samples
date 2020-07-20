import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LayoutComponent } from './components/layout/layout.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { EmployeeComponent } from './components/employee/employee.component';
import { CodeComponentsComponent } from './components/code-components/code-components.component';
import { DocumentsComponent } from './components/documents/documents.component';
import { EventsComponent } from './components/events/events.component';
import { GalleryComponent } from './components/gallery/gallery.component';
import { HardwareConfigComponent } from './components/hardware-config/hardware-config.component';
import { InventoryComponent } from './components/inventory/inventory.component';
import { ProfileComponent } from './components/profile/profile.component';
import { ProjectsComponent } from './components/projects/projects.component';
import { UnauthorisedComponent } from 'src/app/shared/unauthorised/unauthorised/unauthorised.component';
import { CustomGuard } from 'src/app/core/guards/custom.guard';
import { RolesPermissionComponent } from './components/roles-permissions/roles-permission.component';
import { AddEprojectcreensComponent } from './components/add-edit-screens/add-edit-screens.component';


const routes: Routes = [
  {
    path: "",
    component: LayoutComponent,
    children: [
      {
        path: "",
        redirectTo: "dashboard",
        pathMatch: "full"
      },
      {
        path: "dashboard",
        component: DashboardComponent,
      },
      {
        path: "employee",
        component: EmployeeComponent,
      },

      {
        path: "code-components",
        component: CodeComponentsComponent,
      },
      {
        path: "documents",
        component: DocumentsComponent,
      },
      {
        path: "events",
        component: EventsComponent,
      },
      {
        path: "gallery",
        component: GalleryComponent,
      },
      {
        path: "hardware-config",
        component: HardwareConfigComponent,
      },
      {
        path: "inventory",
        component: InventoryComponent,
      },
      {
        path: "profile",
        component: ProfileComponent,
      }, {
        path: "projects",
        component: ProjectsComponent,
      }, {
        path: "roles-permissions",
        component: RolesPermissionComponent,
      }, {
        path: "admin-screens",
        component: AddEprojectcreensComponent,
      },
      {
        path: "**",
        component: UnauthorisedComponent,
        canActivate: [CustomGuard],
        data: {
          expectedRole: ['']
        }
      }  
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],

})
export class AdminRoutingModule { }

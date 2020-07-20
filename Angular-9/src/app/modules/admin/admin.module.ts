import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ProfileComponent } from './components/profile/profile.component';
import { InventoryComponent } from './components/inventory/inventory.component';
import { EventsComponent } from './components/events/events.component';
import { GalleryComponent } from './components/gallery/gallery.component';
import { HardwareConfigComponent } from './components/hardware-config/hardware-config.component';
import { DocumentsComponent } from './components/documents/documents.component';
import { CodeComponentsComponent } from './components/code-components/code-components.component';
import { ProjectsComponent } from './components/projects/projects.component';
import { EmployeeComponent } from './components/employee/employee.component';
import { LayoutComponent } from './components/layout/layout.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { RolesPermissionComponent } from './components/roles-permissions/roles-permission.component';
import { AddEprojectcreensComponent } from './components/add-edit-screens/add-edit-screens.component';



@NgModule({
  declarations: [DashboardComponent, RolesPermissionComponent, ProfileComponent, InventoryComponent, EventsComponent, GalleryComponent, HardwareConfigComponent, DocumentsComponent, CodeComponentsComponent, ProjectsComponent, EmployeeComponent, LayoutComponent, AddEprojectcreensComponent],
  imports: [
    CommonModule,
    AdminRoutingModule,
    SharedModule
  ]
})
export class AdminModule { }

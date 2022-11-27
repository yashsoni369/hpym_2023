import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { AdminComponent } from './admin.component';
import { RegListComponent } from './components/reg-list/reg-list.component';
import { RegDashboardComponent } from './components/reg-dashboard/reg-dashboard.component';
import { LoginComponent } from './components/login/login.component';
import { GuiGridModule } from '@generic-ui/ngx-grid';


@NgModule({
  declarations: [
    AdminComponent,
    RegListComponent,
    RegDashboardComponent,
    LoginComponent
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    GuiGridModule
  ]
})
export class AdminModule { }

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SecurityUsersComponent } from './users/users.component';
import { SecurityPeopleComponent } from './people/people.component';
import { SecurityRolesComponent } from './roles/roles.component';

const routes: Routes = [
  { path: 'users', component: SecurityUsersComponent },
  { path: 'people', component: SecurityPeopleComponent },
  { path: 'roles', component: SecurityRolesComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SecurityRoutingModule {}

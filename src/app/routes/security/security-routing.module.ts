import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SecurityUsersComponent } from './users/users.component';
import { SecurityPeopleComponent } from './people/people.component';

const routes: Routes = [
  { path: 'users', component: SecurityUsersComponent },
  { path: 'people', component: SecurityPeopleComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SecurityRoutingModule {}

import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { SecurityRoutingModule } from './security-routing.module';
import { SecurityUsersComponent } from './users/users.component';
import { SecurityUsersListComponent } from './users/list/list.component';
import { SecurityUsersFormComponent } from './users/form/form.component';
import { SecurityPeopleComponent } from './people/people.component';

const COMPONENTS = [SecurityUsersComponent, SecurityPeopleComponent];
const COMPONENTS_DYNAMIC = [SecurityUsersListComponent, SecurityUsersFormComponent];

@NgModule({
  imports: [
    SharedModule,
    SecurityRoutingModule
  ],
  declarations: [
    ...COMPONENTS,
    ...COMPONENTS_DYNAMIC
  ],
  entryComponents: COMPONENTS_DYNAMIC
})
export class SecurityModule { }

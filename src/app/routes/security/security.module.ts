import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { SecurityRoutingModule } from './security-routing.module';
import { SecurityUsersComponent } from './users/users.component';
import { SecurityPeopleComponent } from './people/people.component';
import { SecurityUsersAdduserComponent } from './users/adduser/adduser.component';

const COMPONENTS = [SecurityUsersComponent, SecurityPeopleComponent];
const COMPONENTS_DYNAMIC = [SecurityUsersAdduserComponent];

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

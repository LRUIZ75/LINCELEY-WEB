import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { SecurityRoutingModule } from './security-routing.module';
import { SecurityUsersComponent } from './users/users.component';
import { SecurityPeopleComponent } from './people/people.component';
import { AddComponent } from './users/add/add.component';
import { SecurityRolesComponent } from './roles/roles.component';
import { AddpeopleComponent } from './people/addpeople/addpeople.component';
import { PersoncardComponent } from './people/personcard/personcard.component';

const COMPONENTS = [SecurityUsersComponent, SecurityPeopleComponent, SecurityRolesComponent];
const COMPONENTS_DYNAMIC = [];

@NgModule({
  imports: [
    SharedModule,
    SecurityRoutingModule,
  ],
  declarations: [
    ...COMPONENTS,
    ...COMPONENTS_DYNAMIC,
    AddComponent,
    AddpeopleComponent,
    PersoncardComponent,
  ],
  entryComponents: COMPONENTS_DYNAMIC
})
export class SecurityModule { }

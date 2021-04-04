import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { OrgRoutingModule } from './org-routing.module';
import { OrgCompaniesComponent } from './companies/companies.component';
import { OrgDepartmentsComponent } from './departments/departments.component';
import { OrgJobpositionsComponent } from './jobpositions/jobpositions.component';
import { OrgEmployeesComponent } from './employees/employees.component';
import { OrgDcsComponent } from './dcs/dcs.component';

const COMPONENTS = [OrgCompaniesComponent, OrgDepartmentsComponent, OrgJobpositionsComponent, OrgEmployeesComponent, OrgDcsComponent];
const COMPONENTS_DYNAMIC = [];

@NgModule({
  imports: [
    SharedModule,
    OrgRoutingModule
  ],
  declarations: [
    ...COMPONENTS,
    ...COMPONENTS_DYNAMIC
  ],
  entryComponents: COMPONENTS_DYNAMIC
})
export class OrgModule { }

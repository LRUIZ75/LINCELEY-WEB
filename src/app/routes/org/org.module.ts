import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { OrgRoutingModule } from './org-routing.module';
import { OrgCompaniesComponent } from './companies/companies.component';
import { OrgDepartmentsComponent } from './departments/departments.component';
import { OrgJobpositionsComponent } from './jobpositions/jobpositions.component';
import { OrgEmployeesComponent } from './employees/employees.component';
import { OrgDcsComponent } from './dcs/dcs.component';
import { AddcompanyComponent } from './companies/addcompany/addcompany.component';
import { AdddepartmentComponent } from './departments/adddepartment/adddepartment.component';
import { AddjobpositionComponent } from './jobpositions/addjobposition/addjobposition.component';
import { AddemployeeComponent } from './employees/addemployee/addemployee.component';
import { AdddcComponent } from './dcs/adddc/adddc.component';
import { DataTableModule } from 'ornamentum';

const COMPONENTS = [OrgCompaniesComponent, OrgDepartmentsComponent, OrgJobpositionsComponent, OrgEmployeesComponent, OrgDcsComponent];
const COMPONENTS_DYNAMIC = [];

@NgModule({
  imports: [
    SharedModule,
    OrgRoutingModule,
    DataTableModule.forRoot()
  ],
  declarations: [
    ...COMPONENTS,
    ...COMPONENTS_DYNAMIC,
    AddcompanyComponent,
    AdddepartmentComponent,
    AddjobpositionComponent,
    AddemployeeComponent,
    AdddcComponent
  ],
  entryComponents: COMPONENTS_DYNAMIC
})
export class OrgModule { }

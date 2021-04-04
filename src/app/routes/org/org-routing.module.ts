import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OrgCompaniesComponent } from './companies/companies.component';
import { OrgDepartmentsComponent } from './departments/departments.component';
import { OrgJobpositionsComponent } from './jobpositions/jobpositions.component';
import { OrgEmployeesComponent } from './employees/employees.component';
import { OrgDcsComponent } from './dcs/dcs.component';

const routes: Routes = [{ path: 'companies', component: OrgCompaniesComponent },
{ path: 'departments', component: OrgDepartmentsComponent },
{ path: 'jobpositions', component: OrgJobpositionsComponent },
{ path: 'employees', component: OrgEmployeesComponent },
{ path: 'dcs', component: OrgDcsComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OrgRoutingModule { }

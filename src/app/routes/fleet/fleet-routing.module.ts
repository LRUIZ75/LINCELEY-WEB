import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FleetDriversComponent } from './drivers/drivers.component';
import { FleetVehiclesComponent } from './vehicles/vehicles.component';

const routes: Routes = [{ path: 'drivers', component: FleetDriversComponent },
{ path: 'vehicles', component: FleetVehiclesComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FleetRoutingModule { }

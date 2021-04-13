import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { FleetRoutingModule } from './fleet-routing.module';
import { FleetDriversComponent } from './drivers/drivers.component';
import { FleetVehiclesComponent } from './vehicles/vehicles.component';
import { FleetServiceschedulesComponent } from './serviceschedules/serviceschedules.component';
import { FleetAssignmentsComponent } from './assignments/assignments.component';
import { AdddriverComponent } from './drivers/adddriver/adddriver.component';
import { AddvehicleComponent } from './vehicles/addvehicle/addvehicle.component';

const COMPONENTS = [FleetDriversComponent, FleetVehiclesComponent, FleetServiceschedulesComponent, FleetAssignmentsComponent];
const COMPONENTS_DYNAMIC = [];

@NgModule({
  imports: [
    SharedModule,
    FleetRoutingModule
  ],
  declarations: [
    ...COMPONENTS,
    ...COMPONENTS_DYNAMIC,
    AdddriverComponent,
    AddvehicleComponent
  ],
  entryComponents: COMPONENTS_DYNAMIC
})
export class FleetModule { }

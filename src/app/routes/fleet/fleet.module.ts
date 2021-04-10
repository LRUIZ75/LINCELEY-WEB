import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { FleetRoutingModule } from './fleet-routing.module';
import { FleetDriversComponent } from './drivers/drivers.component';
import { FleetVehiclesComponent } from './vehicles/vehicles.component';

const COMPONENTS = [FleetDriversComponent, FleetVehiclesComponent];
const COMPONENTS_DYNAMIC = [];

@NgModule({
  imports: [
    SharedModule,
    FleetRoutingModule
  ],
  declarations: [
    ...COMPONENTS,
    ...COMPONENTS_DYNAMIC
  ],
  entryComponents: COMPONENTS_DYNAMIC
})
export class FleetModule { }

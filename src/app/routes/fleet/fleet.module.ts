import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { FleetRoutingModule } from './fleet-routing.module';
import { FleetDriversComponent } from './drivers/drivers.component';
import { FleetVehiclesComponent } from './vehicles/vehicles.component';
import { FleetServiceschedulesComponent } from './serviceschedules/serviceschedules.component';
import { FleetAssignmentsComponent } from './assignments/assignments.component';
import { AdddriverComponent } from './drivers/adddriver/adddriver.component';
import { AddvehicleComponent } from './vehicles/addvehicle/addvehicle.component';
import { AddservscheduleComponent } from './serviceschedules/addservschedule/addservschedule.component';
import { AddassignmentComponent } from './assignments/addassignment/addassignment.component';
import { DataTableModule } from 'ornamentum';

const COMPONENTS = [FleetDriversComponent, FleetVehiclesComponent, FleetServiceschedulesComponent, FleetAssignmentsComponent];
const COMPONENTS_DYNAMIC = [];

@NgModule({
  imports: [
    SharedModule,
    FleetRoutingModule,
    DataTableModule.forRoot()
  ],
  declarations: [
    ...COMPONENTS,
    ...COMPONENTS_DYNAMIC,
    AdddriverComponent,
    AddvehicleComponent,
    AddservscheduleComponent,
    AddassignmentComponent
  ],
  entryComponents: COMPONENTS_DYNAMIC
})
export class FleetModule { }

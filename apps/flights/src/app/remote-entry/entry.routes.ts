import { Route } from '@angular/router';
// import { RemoteEntry } from './entry';
import { FlightsListComponent } from './flights-list.component';

export const remoteRoutes: Route[] = [
  { path: '', component: FlightsListComponent },
  {
    path: ':flightId', // embedded in shell
    loadComponent: () =>
      import('./flight-details.component').then(
        (m) => m.FlightDetailsComponent
      ),
    title: 'Flight Details',
  },
  {
    path: 'flights/:flightId', // standalone MF
    loadComponent: () =>
      import('./flight-details.component').then(
        (m) => m.FlightDetailsComponent
      ),
    title: 'Flight Details',
  },
];

import { Component, inject } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Observable } from 'rxjs';

import { FlightDto } from '@info-mf-nx/contracts';

import { FlightsService } from './flights.service';
import { ReserveFlightComponent } from './reserve-flight.component';

/** Patrz komentarz w `employees-list.component.ts` - ten sam błąd z `effect()`. */
@Component({
  selector: 'info-mf-nx-flights-list',
  imports: [AsyncPipe, RouterLink, ReserveFlightComponent],
  templateUrl: './flight-list.html',
})
export class FlightsListComponent {
  readonly #flightsService = inject(FlightsService);

  readonly flights$: Observable<FlightDto[]> = this.#flightsService.getFlights();
}

import { Component, effect, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Observable } from 'rxjs';

import { FlightsService } from './flights.service';
import { Flight } from './dtos/Flight.dto';
import { ReserveFlightComponent } from './reserve-flight.component';

@Component({
  selector: 'info-mf-nx-flights-list',
  imports: [CommonModule, RouterLink, ReserveFlightComponent],
  templateUrl: './flight-list.html',
})
export class FlightsListComponent {
  private flightsService = inject(FlightsService);
  flights$!: Observable<Flight[]>;

  constructor() {
    effect(() => {
      this.flights$ = this.flightsService.getFlights();
    });
  }
}

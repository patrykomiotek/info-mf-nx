import { Component, effect, inject, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';

import { FlightsService } from './flights.service';
import { Flight } from './dtos/Flight.dto';
import { ReserveFlightComponent } from './reserve-flight.component';

@Component({
  selector: 'info-mf-nx-flight-details',
  imports: [CommonModule, RouterLink, ReserveFlightComponent],
  template: `
    <div>
      <h2 class="text-2xl font-bold">Flight Details</h2>
      @if (flight$ | async; as flightData) {
      <div>
        <p><strong>ID:</strong> {{ flightData.id }}</p>
        <p><strong>Name:</strong> {{ flightData.name }}</p>
        <p><strong>Description:</strong> {{ flightData.description }}</p>
        <p><strong>Price:</strong> {{ flightData.price }} zł</p>
        <info-mf-nx-reserve-flight [flight]="flightData" />
        <a routerLink="/flights/list" class="text-blue-500">Back to flights</a>
      </div>
      } @else {
      <p>Flight not found</p>
      }
    </div>
  `,
})
export class FlightDetailsComponent {
  private flightsService = inject(FlightsService);
  @Input() flightId!: number;
  flight$!: Observable<Flight | undefined>;
  constructor() {
    effect(() => {
      if (this.flightId) {
        this.flight$ = this.flightsService.getFlightById(this.flightId);
      }
    });
  }
}

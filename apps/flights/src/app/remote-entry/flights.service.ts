import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { FlightDto } from '@info-mf-nx/contracts';
import { API_BASE_URL } from '../consts';

@Injectable({
  providedIn: 'root',
})
export class FlightsService {
  private http = inject(HttpClient);

  getFlights(): Observable<FlightDto[]> {
    return this.http.get<FlightDto[]>(`${API_BASE_URL}/flights`);
  }

  getFlightById(id: number): Observable<FlightDto | undefined> {
    return this.http.get<FlightDto>(`${API_BASE_URL}/flights/${id}`);
  }
}

import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Flight } from './dtos/Flight.dto';
import { API_BASE_URL } from '../consts';

@Injectable({
  providedIn: 'root',
})
export class FlightsService {
  private http = inject(HttpClient);

  getFlights(): Observable<Flight[]> {
    return this.http.get<Flight[]>(`${API_BASE_URL}/flights`);
  }

  getFlightById(id: number): Observable<Flight | undefined> {
    return this.http.get<Flight>(`${API_BASE_URL}/flights/${id}`);
  }
}

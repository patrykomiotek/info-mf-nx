import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { EmployeeDto } from '@info-mf-nx/contracts';
import { API_BASE_URL } from '../../consts';

@Injectable({
  providedIn: 'root',
})
export class EmployeeService {
  private http = inject(HttpClient);

  getEmployees(): Observable<EmployeeDto[]> {
    return this.http.get<EmployeeDto[]>(`${API_BASE_URL}/employees`);
  }

  getEmployeeById(id: number): Observable<EmployeeDto | undefined> {
    return this.http.get<EmployeeDto>(`${API_BASE_URL}/employees/${id}`);
  }
}

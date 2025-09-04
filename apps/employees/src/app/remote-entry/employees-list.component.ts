import { Component, effect, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { RouterLink } from '@angular/router';

import { EmployeeDto } from '@info-mf-nx/contracts';

import { EmployeeService } from './employees.service';

@Component({
  selector: 'info-mf-nx-employees-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './employees-list.html',
})
export class EmployeesListComponent {
  private employeesService = inject(EmployeeService);
  employees$!: Observable<EmployeeDto[]>;

  constructor() {
    effect(() => {
      this.employees$ = this.employeesService.getEmployees();
    });
  }
}

import { Component, inject } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { Observable } from 'rxjs';
import { RouterLink } from '@angular/router';

import { EmployeeDto } from '@info-mf-nx/contracts';

import { EmployeeService } from './employees.service';

/**
 * Poprzednia wersja przypisywała `employees$` wewnątrz `effect()`.
 * Efekt nie czytał tam ani jednego sygnału, więc nie miał od czego zależeć -
 * wykonywał się raz, po pierwszym wykryciu zmian, czyli PÓŹNIEJ niż pierwsze
 * renderowanie szablonu. To dawało jedno zbędne przejście przez `| async`
 * z wartością `undefined`, a w trybie zoneless potrafi nie wykonać się wcale.
 *
 * Zwykłe pole klasy załatwia to samo, wcześniej i bez efektu.
 */
@Component({
  selector: 'info-mf-nx-employees-list',
  standalone: true,
  imports: [AsyncPipe, RouterLink],
  templateUrl: './employees-list.html',
})
export class EmployeesListComponent {
  readonly #employeesService = inject(EmployeeService);

  readonly employees$: Observable<EmployeeDto[]> =
    this.#employeesService.getEmployees();
}

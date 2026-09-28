import { Component, Type, signal } from '@angular/core';
import { NgComponentOutlet } from '@angular/common';
import { RouterLink } from '@angular/router';

/**
 * Strona główna shella.
 *
 * Mieszka tu demo ładowania POJEDYNCZEGO KOMPONENTU z remote'a
 * (`employees/EmployeesList`), a nie całych tras. Wcześniej ten sam kod
 * siedział w `app.html` poza `router-outlet`, więc lista pracowników
 * renderowała się na każdej trasie, a na `/employees` dwa razy.
 */
@Component({
  selector: 'info-mf-nx-home',
  imports: [NgComponentOutlet, RouterLink],
  template: `
    <div class="space-y-8">
      <section class="space-y-2">
        <h1 class="text-3xl font-semibold text-slate-900">Shell</h1>
        <p class="max-w-2xl text-slate-600">
          Host spina trzy mikrofrontendy ładowane przez Module Federation:
          <a
            routerLink="/flights"
            class="font-medium text-sky-700 underline-offset-4 hover:underline"
            >Flights</a
          >,
          <a
            routerLink="/cart"
            class="font-medium text-sky-700 underline-offset-4 hover:underline"
            >Cart</a
          >
          i
          <a
            routerLink="/employees"
            class="font-medium text-sky-700 underline-offset-4 hover:underline"
            >Employees</a
          >. Komunikują się wyłącznie zdarzeniami, bez wspólnego stanu.
        </p>
      </section>

      <section class="space-y-3">
        <div class="flex items-center gap-3">
          <h2 class="text-lg font-semibold text-slate-900">
            Komponent z remote'a
          </h2>
          <span
            class="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600"
          >
            employees/EmployeesList
          </span>
        </div>
        <p class="max-w-2xl text-sm text-slate-500">
          Poniższa lista nie jest trasą. To pojedynczy komponent zaciągnięty
          z mikrofrontendu <code>employees</code> i osadzony przez
          <code>NgComponentOutlet</code>.
        </p>

        <div class="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
          @if (employeeList(); as component) {
            <ng-container *ngComponentOutlet="component" />
          } @else if (failed()) {
            <p class="text-sm text-red-600">
              Nie udało się załadować komponentu z mikrofrontendu
              <code>employees</code>. Sprawdź, czy działa na porcie 4203.
            </p>
          } @else {
            <p class="text-sm text-slate-400">Ładuję komponent…</p>
          }
        </div>
      </section>
    </div>
  `,
})
export class Home {
  protected readonly employeeList = signal<Type<unknown> | null>(null);
  protected readonly failed = signal(false);

  constructor() {
    this.loadEmployeeList();
  }

  private async loadEmployeeList(): Promise<void> {
    try {
      const module = await import('employees/EmployeesList');
      this.employeeList.set(module.EmployeesListComponent);
    } catch (error) {
      // Awaria jednego remote'a nie może wywalić hosta. Pokazujemy komunikat
      // w miejscu, w którym miał być komponent, i idziemy dalej.
      console.error('[shell] nie udało się załadować employees/EmployeesList', error);
      this.failed.set(true);
    }
  }
}

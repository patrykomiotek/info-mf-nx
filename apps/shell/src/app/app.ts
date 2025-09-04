import { Component, signal, Type } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NgComponentOutlet } from '@angular/common';
import { ButtonComponent } from '@info-mf-nx/tim-ui';
import { TimModals } from '@tim-modals';

@Component({
  imports: [RouterModule, ButtonComponent, TimModals, NgComponentOutlet],
  selector: 'info-mf-nx-root',
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected title = 'shell';

  employeeList = signal<Type<unknown> | null>(null);

  constructor() {
    this.loadEmployeeList();
  }

  private async loadEmployeeList() {
    try {
      const component = await import('employees/EmployeesList');
      this.employeeList.set(component.EmployeesListComponent);
    } catch (error) {
      console.error('Error loading employees list component', error);
    }
  }
}

import { Component } from '@angular/core';
// import { NxWelcome } from './nx-welcome';
import { EmployeesListComponent } from './employees-list.component';

@Component({
  imports: [EmployeesListComponent],
  selector: 'info-mf-nx-employees-entry',
  // template: `<info-mf-nx-nx-welcome></info-mf-nx-nx-welcome>`,
  template: `<info-mf-nx-employees-list />`,
})
export class RemoteEntry {}

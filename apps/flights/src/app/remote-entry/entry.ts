import { Component } from '@angular/core';
import { NxWelcome } from './nx-welcome';

@Component({
  imports: [NxWelcome],
  selector: 'info-mf-nx-flights-entry',
  template: `<info-mf-nx-nx-welcome></info-mf-nx-nx-welcome>`,
})
export class RemoteEntry {}

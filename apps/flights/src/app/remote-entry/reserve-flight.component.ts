import { Component, Input } from '@angular/core';

import { Flight } from './dtos/Flight.dto';

@Component({
  selector: 'info-mf-nx-reserve-flight',
  template: `<button class="text-blue-500" (click)="reserve()">
    Reserve flight
  </button>`,
  styles: `
    :host {
      display: block;
    }
  `,
})
export class ReserveFlightComponent {
  @Input() flight!: Flight;
  public reserve() {
    window.parent.postMessage(
      { type: 'ADD_FLIGHT', payload: this.flight },
      '*'
    );
  }
}

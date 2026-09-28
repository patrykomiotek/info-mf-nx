import { Component, inject, input } from '@angular/core';

import { FlightDto } from '@info-mf-nx/contracts';
import { EventBusService } from '@info-mf-nx/event-bus';

/**
 * Publikuje rezerwację na szynie zdarzeń.
 *
 * Poprzednia wersja wołała `window.parent.postMessage(...)`, czyli mechanizm
 * przeznaczony do komunikacji przez IFRAME. Tutaj nie ma iframe'a - shell
 * i remote'y dzielą jedno `window`, więc `window.parent === window`
 * i wiadomość trafiała donikąd: nikt jej nie słuchał, a przycisk nie robił nic.
 *
 * `flights` nadal NIE WIE, że koszyk istnieje. Publikuje fakt biznesowy
 * i na tym kończy się jego odpowiedzialność, więc odbiorca może się zmienić,
 * zniknąć albo dojść bez żadnej zmiany w tym pliku.
 */
@Component({
  selector: 'info-mf-nx-reserve-flight',
  template: `
    <button
      type="button"
      class="rounded-md bg-sky-600 px-3 py-1.5 text-sm font-medium text-white
             transition hover:bg-sky-700 focus-visible:outline focus-visible:outline-2
             focus-visible:outline-offset-2 focus-visible:outline-sky-600"
      (click)="reserve()"
    >
      Reserve flight
    </button>
  `,
  styles: `
    :host {
      display: inline-block;
    }
  `,
})
export class ReserveFlightComponent {
  readonly flight = input.required<FlightDto>();

  readonly #bus = inject(EventBusService);

  reserve(): void {
    this.#bus.publish({
      type: 'FLIGHT_RESERVED',
      version: 1,
      payload: { flight: this.flight() },
    });
  }
}

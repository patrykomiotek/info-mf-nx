import { Component, inject } from '@angular/core';

import { CartStore, EventBusService } from '@info-mf-nx/event-bus';

/**
 * Koszyk jako ODBIORCA zdarzeń.
 *
 * Nie odpytuje API lotów i nie wie, że `flights` istnieje. Cała jego wiedza
 * pochodzi ze zdarzeń na szynie, a `CartStore` jest ich projekcją.
 *
 * Usunięcie pozycji też idzie przez szynę, a nie przez bezpośrednie wywołanie
 * metody na sklepie. Gdyby szło na skróty, pozostałe mikrofrontendy
 * (na przykład licznik w nagłówku shella) nie dowiedziałyby się o zmianie.
 */
@Component({
  selector: 'info-mf-nx-cart-entry',
  template: `
    <section class="space-y-6">
      <header class="flex items-baseline justify-between gap-4">
        <h1 class="text-2xl font-semibold text-slate-900">Koszyk</h1>
        @if (!cart.isEmpty()) {
          <button
            type="button"
            class="text-sm font-medium text-slate-500 underline-offset-4
                   transition hover:text-slate-900 hover:underline"
            (click)="clear()"
          >
            Wyczyść koszyk
          </button>
        }
      </header>

      @if (cart.isEmpty()) {
        <p
          class="rounded-lg border border-dashed border-slate-300 bg-slate-50
                 p-8 text-center text-slate-500"
        >
          Koszyk jest pusty. Zarezerwuj lot w zakładce
          <span class="font-medium text-slate-700">Flights</span>.
        </p>
      } @else {
        <ul class="space-y-3">
          @for (item of cart.items(); track item.flight.id) {
            <li
              class="flex items-center gap-4 rounded-lg border border-slate-200
                     bg-white p-4 shadow-sm"
            >
              <div class="min-w-0 flex-1">
                <p class="truncate font-medium text-slate-900">
                  {{ item.flight.name }}
                </p>
                <p class="truncate text-sm text-slate-500">
                  {{ item.flight.description }}
                </p>
              </div>

              @if (item.quantity > 1) {
                <span
                  class="rounded-full bg-slate-100 px-2 py-0.5 text-xs
                         font-medium text-slate-600"
                >
                  &times;{{ item.quantity }}
                </span>
              }

              <span class="w-24 text-right font-semibold text-slate-900">
                {{ item.quantity * item.flight.price }} zł
              </span>

              <button
                type="button"
                class="rounded-md px-2 py-1 text-sm text-slate-400 transition
                       hover:bg-red-50 hover:text-red-600"
                [attr.aria-label]="'Usuń ' + item.flight.name"
                (click)="remove(item.flight.id)"
              >
                &times;
              </button>
            </li>
          }
        </ul>

        <footer
          class="flex items-baseline justify-between border-t border-slate-200 pt-4"
        >
          <span class="text-slate-600">
            Pozycji: <strong class="text-slate-900">{{ cart.count() }}</strong>
          </span>
          <span class="text-lg font-semibold text-slate-900">
            Razem: {{ cart.total() }} zł
          </span>
        </footer>
      }
    </section>
  `,
})
export class RemoteEntry {
  protected readonly cart = inject(CartStore);
  readonly #bus = inject(EventBusService);

  protected remove(flightId: number): void {
    this.#bus.publish({
      type: 'FLIGHT_REMOVED_FROM_CART',
      version: 1,
      payload: { flightId },
    });
  }

  protected clear(): void {
    this.#bus.publish({ type: 'CART_CLEARED', version: 1 });
  }
}

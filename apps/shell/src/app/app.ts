import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';

import { CartStore } from '@info-mf-nx/event-bus';

/**
 * Shell trzyma wyłącznie ramę: nagłówek, nawigację i licznik koszyka.
 * Treść przychodzi z mikrofrontendów przez `router-outlet`.
 *
 * Licznik nie pyta o nic koszyka ani lotów - jest kolejną projekcją tego
 * samego strumienia zdarzeń, więc aktualizuje się także wtedy, gdy użytkownik
 * siedzi na zakładce Flights.
 */
@Component({
  imports: [RouterModule],
  selector: 'info-mf-nx-root',
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly cart = inject(CartStore);

  protected readonly nav = [
    { path: '/', label: 'Home' },
    { path: '/flights', label: 'Flights' },
    { path: '/cart', label: 'Cart' },
    { path: '/employees', label: 'Employees' },
  ] as const;
}

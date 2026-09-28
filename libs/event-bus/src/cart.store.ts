import { Injectable, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { FlightDto } from '@info-mf-nx/contracts';

import { EventBusService } from './event-bus.service';

const STORAGE_KEY = 'info-mf-nx.cart';

export type CartItem = {
  readonly flight: FlightDto;
  readonly quantity: number;
};

/**
 * Koszyk jako PROJEKCJA STRUMIENIA ZDARZEŃ.
 *
 * Nie jest to wspólny, mutowalny stan przekazywany między mikrofrontendami -
 * taki stan oznaczałby wspólne wdrożenie. To jest read model: każdy
 * mikrofrontend, który wstrzyknie ten serwis, zbuduje sobie własną kopię
 * z tych samych zdarzeń na `window`.
 *
 * Dzięki temu działa niezależnie od tego, czy federacja współdzieli tę
 * bibliotekę jako singleton. Jeśli tak - jest jedna instancja. Jeśli nie -
 * jest ich kilka, ale wszystkie widzą te same zdarzenia i zbiegają się
 * do tego samego stanu. To celowa właściwość, nie przypadek.
 *
 * `localStorage` jest tu potrzebny, bo zdarzenia są ulotne: po odświeżeniu
 * strony strumień zaczyna się od zera, a koszyk ma przeżyć.
 */
@Injectable({ providedIn: 'root' })
export class CartStore {
  readonly #bus = inject(EventBusService);
  readonly #items = signal<readonly CartItem[]>(readFromStorage());

  readonly items = this.#items.asReadonly();
  readonly count = computed(() =>
    this.#items().reduce((sum, item) => sum + item.quantity, 0)
  );
  readonly isEmpty = computed(() => this.count() === 0);
  /** Suma w tej samej jednostce, co `FlightDto.price`. */
  readonly total = computed(() =>
    this.#items().reduce((sum, item) => sum + item.quantity * item.flight.price, 0)
  );

  constructor() {
    this.#bus
      .on('FLIGHT_RESERVED')
      .pipe(takeUntilDestroyed())
      .subscribe((event) => this.#add(event.payload.flight));

    this.#bus
      .on('FLIGHT_REMOVED_FROM_CART')
      .pipe(takeUntilDestroyed())
      .subscribe((event) => this.#remove(event.payload.flightId));

    this.#bus
      .on('CART_CLEARED')
      .pipe(takeUntilDestroyed())
      .subscribe(() => this.#setItems([]));
  }

  // Metody zapisu celowo PRYWATNE. Do koszyka nie wkłada się nic wprost -
  // wyłącznie przez zdarzenie na szynie. Gdyby dało się ominąć szynę,
  // pozostałe mikrofrontendy nie dowiedziałyby się o zmianie.

  #add(flight: FlightDto): void {
    this.#setItems(
      this.#items().some((item) => item.flight.id === flight.id)
        ? this.#items().map((item) =>
            item.flight.id === flight.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          )
        : [...this.#items(), { flight, quantity: 1 }]
    );
  }

  #remove(flightId: number): void {
    this.#setItems(this.#items().filter((item) => item.flight.id !== flightId));
  }

  #setItems(items: readonly CartItem[]): void {
    this.#items.set(items);
    writeToStorage(items);
  }
}

function readFromStorage(): readonly CartItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];

    const parsed: unknown = JSON.parse(raw);
    // Zawartość `localStorage` to dane z poprzedniej wersji aplikacji.
    // Traktujemy je tak samo nieufnie jak cudze zdarzenie.
    return Array.isArray(parsed) ? (parsed as CartItem[]) : [];
  } catch {
    return [];
  }
}

function writeToStorage(items: readonly CartItem[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    // Tryb prywatny albo zapełniony magazyn. Koszyk ma działać dalej,
    // tylko bez przeżycia odświeżenia.
  }
}

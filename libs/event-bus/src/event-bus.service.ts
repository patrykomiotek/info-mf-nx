import { DestroyRef, Injectable, inject, isDevMode } from '@angular/core';
import { Observable, Subject, filter } from 'rxjs';

import {
  INFO_EVENT_CHANNEL,
  isInfoEvent,
  type EventOfType,
  type InfoEvent,
  type InfoEventType,
} from './events';

/**
 * Szyna zdarzeń między mikrofrontendami, oparta na `CustomEvent` i `window`,
 * czyli na standardzie przeglądarki.
 *
 * Dlaczego nie sam `Subject`: mikrofrontendy ładowane przez Module Federation
 * dostają własne instancje serwisu, jeśli biblioteka nie jest współdzielona
 * jako singleton. `window` jest jedno zawsze, więc zdarzenie dociera wszędzie
 * niezależnie od konfiguracji federacji. `Subject` jest tu wyłącznie adapterem
 * na RxJS dla wygody komponentów.
 *
 * JEDNA DROGA DOSTARCZANIA. `publish()` tylko wysyła `CustomEvent`, a lokalny
 * `Subject` karmi się WYŁĄCZNIE z nasłuchu na `window`. Dzięki temu nadawca
 * dostaje własne zdarzenie dokładnie raz, tak samo jak wszyscy inni.
 * Poprzednia wersja emitowała lokalnie i jednocześnie broadcastowała,
 * a listener emitował jeszcze raz, więc każdy odbiorca dostawał dublet.
 */
@Injectable({ providedIn: 'root' })
export class EventBusService {
  readonly #events = new Subject<InfoEvent>();

  /** Publiczny strumień wszystkich zdarzeń. */
  readonly events$: Observable<InfoEvent> = this.#events.asObservable();

  readonly #listener = (raw: Event): void => {
    const detail = (raw as CustomEvent<unknown>).detail;

    // Tolerancyjny odbiorca: cudzy śmieć na tym samym kanale nas nie wywraca.
    // UWAGA: czytamy `detail`, a nie samo `raw`. Poprzednia wersja rzutowała
    // cały CustomEvent na InfoEvent, więc odbiorcy dostawali opakowanie
    // zamiast zdarzenia i `event.type` było nazwą zdarzenia DOM.
    if (!isInfoEvent(detail)) {
      this.#warn('zignorowano zdarzenie o nieznanym kształcie', detail);
      return;
    }

    this.#events.next(detail);
  };

  constructor() {
    window.addEventListener(INFO_EVENT_CHANNEL, this.#listener);

    // Bez tego nasłuch przeżywa serwis. Przy mikrofrontendach ładowanych
    // i odładowywanych w trakcie nawigacji to realny wyciek.
    inject(DestroyRef).onDestroy(() => {
      window.removeEventListener(INFO_EVENT_CHANNEL, this.#listener);
      this.#events.complete();
    });
  }

  /**
   * Publikuje zdarzenie do wszystkich mikrofrontendów na stronie.
   *
   * Nadawca nie wie, kto słucha, i nie dostaje odpowiedzi. Gdyby kiedykolwiek
   * zapragnął wartości zwracanej, byłby to sygnał, że granica jest w złym
   * miejscu, a nie że szynie czegoś brakuje.
   */
  publish(event: InfoEvent): void {
    if (isDevMode() && !isSerializable(event)) {
      this.#warn(
        `payload zdarzenia "${event.type}" nie jest serializowalny; ` +
          'przez granicę mikrofrontendu przechodzą tylko dane, ' +
          'nie funkcje ani instancje klas',
        event
      );
      return;
    }

    window.dispatchEvent(new CustomEvent(INFO_EVENT_CHANNEL, { detail: event }));
  }

  /**
   * Strumień jednego typu zdarzenia, zawężony typem.
   *
   * `bus.on('FLIGHT_RESERVED')` zwraca `Observable<FlightReserved>`, więc
   * w komponencie nie ma już rzutowania ani sprawdzania `type`.
   */
  on<T extends InfoEventType>(type: T): Observable<EventOfType<T>> {
    return this.events$.pipe(
      filter((event): event is EventOfType<T> => event.type === type)
    );
  }

  #warn(message: string, detail?: unknown): void {
    if (isDevMode()) {
      console.warn(`[event-bus] ${message}`, detail);
    }
  }
}

/**
 * Przez granicę przechodzi tylko to, co przeżyje `structuredClone`.
 *
 * Gdy `structuredClone` nie istnieje (starsze jsdom w testach, egzotyczne
 * środowisko), sprawdzenia NIE DA SIĘ wykonać i wtedy przepuszczamy zdarzenie.
 * To jest strażnik jakości na czas rozwoju, a nie bramka: brak narzędzia
 * do weryfikacji nie może uciszyć całej szyny.
 */
function isSerializable(value: unknown): boolean {
  if (typeof structuredClone !== 'function') return true;

  try {
    structuredClone(value);
    return true;
  } catch {
    return false;
  }
}

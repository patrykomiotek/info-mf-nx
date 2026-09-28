import { FlightDto } from '@info-mf-nx/contracts';

/**
 * KONTRAKT ZDARZEŃ między mikrofrontendami.
 *
 * Wyłącznie typy i stałe - zero logiki, zero Angulara. Dzięki temu obie strony
 * granicy mogą przez jeden cykl wydawniczy siedzieć na różnych wersjach tego
 * pliku, a to jest cała sensowność mikrofrontendów: niezależne wdrożenia.
 *
 * Nazwa kanału jest jedna dla wszystkich zdarzeń. Rozróżniamy je po `type`,
 * a nie po nazwie zdarzenia DOM, żeby subskrypcja i filtrowanie były w jednym
 * miejscu, a nie rozsypane po `addEventListener`.
 */
export const INFO_EVENT_CHANNEL = 'info-event';

/**
 * Koperta. `version` NIE jest ozdobnikiem: gdy kształt zdarzenia się zmieni,
 * odbiorca może przez jedno wydanie obsłużyć obie wersje. Bez niej każda
 * zmiana kontraktu wymaga jednoczesnego wdrożenia nadawcy i odbiorcy.
 */
export type EventEnvelope<
  TType extends string,
  TVersion extends number,
  TPayload = undefined
> = TPayload extends undefined
  ? { readonly type: TType; readonly version: TVersion }
  : { readonly type: TType; readonly version: TVersion; readonly payload: TPayload };

export type EmployeeSelected = EventEnvelope<
  'EMPLOYEE_SELECTED',
  1,
  { employeeId: number }
>;

export type EmployeeRemoved = EventEnvelope<
  'EMPLOYEE_REMOVED',
  1,
  { employeeId: number }
>;

export type EmployeeFireAll = EventEnvelope<'EMPLOYEE_FIRE_ALL', 1>;

/**
 * Lot trafia do koszyka. Nadawcą jest `flights`, odbiorcami `cart` i `shell`.
 *
 * Payload niesie komplet danych potrzebnych do wyświetlenia pozycji, a nie samo
 * `id`. Gdyby niósł tylko `id`, koszyk musiałby odpytać API lotów - czyli
 * poznać cudzy backend i uzależnić swoje wdrożenie od niego.
 */
export type FlightReserved = EventEnvelope<
  'FLIGHT_RESERVED',
  1,
  { flight: FlightDto }
>;

export type FlightRemovedFromCart = EventEnvelope<
  'FLIGHT_REMOVED_FROM_CART',
  1,
  { flightId: number }
>;

export type CartCleared = EventEnvelope<'CART_CLEARED', 1>;

/** Suma wszystkich zdarzeń. Literówka w nazwie to błąd kompilacji. */
export type InfoEvent =
  | EmployeeSelected
  | EmployeeRemoved
  | EmployeeFireAll
  | FlightReserved
  | FlightRemovedFromCart
  | CartCleared;

export type InfoEventType = InfoEvent['type'];

/** Wyciąga konkretne zdarzenie z sumy po jego `type`. */
export type EventOfType<T extends InfoEventType> = Extract<InfoEvent, { type: T }>;

/**
 * Strażnik kształtu dla TOLERANCYJNEGO ODBIORCY.
 *
 * Sprawdza wyłącznie kopertę. Celowo nie waliduje pól wewnątrz payloadu:
 * nadawca ma prawo dodać pole, o którym my jeszcze nie wiemy, i to nie może
 * wywalić odbiorcy. Bądź rygorystyczny w tym, co wysyłasz, i tolerancyjny
 * w tym, co przyjmujesz.
 */
export function isInfoEvent(value: unknown): value is InfoEvent {
  if (typeof value !== 'object' || value === null) return false;

  const candidate = value as Partial<InfoEvent>;

  return typeof candidate.type === 'string' && typeof candidate.version === 'number';
}

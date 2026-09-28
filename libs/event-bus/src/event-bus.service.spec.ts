import { TestBed } from '@angular/core/testing';

import { CartStore } from './cart.store';
import { EventBusService } from './event-bus.service';
import { INFO_EVENT_CHANNEL, isInfoEvent, type InfoEvent } from './events';

const flight = { id: 1, name: 'Kraków - Gdańsk', description: 'test', price: 500 };

const reserved: InfoEvent = {
  type: 'FLIGHT_RESERVED',
  version: 1,
  payload: { flight },
};

describe('EventBusService', () => {
  let bus: EventBusService;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({});
    bus = TestBed.inject(EventBusService);
  });

  it('dostarcza opublikowane zdarzenie subskrybentowi', () => {
    const odebrane: InfoEvent[] = [];
    bus.events$.subscribe((event) => odebrane.push(event));

    bus.publish(reserved);

    expect(odebrane).toEqual([reserved]);
  });

  /**
   * Regresja. Poprzednia wersja emitowała lokalnie ORAZ broadcastowała,
   * a własny listener emitował jeszcze raz - każdy odbiorca dostawał dublet.
   */
  it('dostarcza zdarzenie DOKŁADNIE RAZ, nie dwa razy', () => {
    const handler = jest.fn();
    bus.events$.subscribe(handler);

    bus.publish(reserved);

    expect(handler).toHaveBeenCalledTimes(1);
  });

  /**
   * Regresja. Poprzednia wersja rzutowała cały `CustomEvent` na `InfoEvent`,
   * więc odbiorca dostawał opakowanie, a `event.type` było nazwą zdarzenia DOM.
   */
  it('przekazuje detail zdarzenia, a nie sam CustomEvent', () => {
    let odebrane: InfoEvent | undefined;
    bus.events$.subscribe((event) => (odebrane = event));

    bus.publish(reserved);

    expect(odebrane?.type).toBe('FLIGHT_RESERVED');
    expect(odebrane).not.toBeInstanceOf(CustomEvent);
  });

  it('on() zawęża strumień do jednego typu', () => {
    const handler = jest.fn();
    bus.on('CART_CLEARED').subscribe(handler);

    bus.publish(reserved);
    expect(handler).not.toHaveBeenCalled();

    bus.publish({ type: 'CART_CLEARED', version: 1 });
    expect(handler).toHaveBeenCalledTimes(1);
  });

  it('ignoruje cudze zdarzenie na tym samym kanale, bez wyjątku', () => {
    const handler = jest.fn();
    bus.events$.subscribe(handler);

    expect(() =>
      window.dispatchEvent(
        new CustomEvent(INFO_EVENT_CHANNEL, { detail: { cokolwiek: true } })
      )
    ).not.toThrow();

    expect(handler).not.toHaveBeenCalled();
  });

  it('nie wywraca się na nieznanym polu w payloadzie', () => {
    const handler = jest.fn();
    bus.events$.subscribe(handler);

    bus.publish({
      ...reserved,
      payload: { flight, coupon: 'X' },
    } as unknown as InfoEvent);

    expect(handler).toHaveBeenCalledTimes(1);
  });
});

describe('isInfoEvent', () => {
  it.each([
    ['null', null],
    ['string', 'FLIGHT_RESERVED'],
    ['brak wersji', { type: 'FLIGHT_RESERVED' }],
    ['brak typu', { version: 1 }],
  ])('odrzuca %s', (_opis, wartosc) => {
    expect(isInfoEvent(wartosc)).toBe(false);
  });

  it('przyjmuje poprawną kopertę', () => {
    expect(isInfoEvent(reserved)).toBe(true);
  });
});

describe('CartStore', () => {
  let bus: EventBusService;
  let cart: CartStore;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({});
    bus = TestBed.inject(EventBusService);
    cart = TestBed.inject(CartStore);
  });

  it('startuje pusty', () => {
    expect(cart.isEmpty()).toBe(true);
    expect(cart.total()).toBe(0);
  });

  it('dodaje lot po zdarzeniu FLIGHT_RESERVED', () => {
    bus.publish(reserved);

    expect(cart.count()).toBe(1);
    expect(cart.total()).toBe(500);
  });

  it('zwiększa ilość zamiast dublować pozycję', () => {
    bus.publish(reserved);
    bus.publish(reserved);

    expect(cart.items()).toHaveLength(1);
    expect(cart.count()).toBe(2);
    expect(cart.total()).toBe(1000);
  });

  it('usuwa pozycję po zdarzeniu FLIGHT_REMOVED_FROM_CART', () => {
    bus.publish(reserved);
    bus.publish({
      type: 'FLIGHT_REMOVED_FROM_CART',
      version: 1,
      payload: { flightId: flight.id },
    });

    expect(cart.isEmpty()).toBe(true);
  });

  it('pustoszeje po CART_CLEARED', () => {
    bus.publish(reserved);
    bus.publish({ type: 'CART_CLEARED', version: 1 });

    expect(cart.isEmpty()).toBe(true);
  });

  it('zapisuje stan, żeby przeżył odświeżenie strony', () => {
    bus.publish(reserved);

    const zapisane = localStorage.getItem('info-mf-nx.cart');
    expect(zapisane).toContain('Kraków - Gdańsk');
  });

  it('nie wywraca się na uszkodzonej zawartości localStorage', () => {
    localStorage.setItem('info-mf-nx.cart', '{to nie jest json');
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({});

    expect(() => TestBed.inject(CartStore).items()).not.toThrow();
  });
});

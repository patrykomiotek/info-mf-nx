import { inject, Injectable } from '@angular/core';
import { Subject } from 'rxjs';

export type InfoEvent =
  | {
      type: 'EMPLOYEE_SELECTED';
      payload: {
        employeeId: number;
      };
    }
  | {
      type: 'EMPLOYEE_REMOVED';
      payload: {
        employeeId: number;
      };
    }
  | {
      type: 'EMPLOYEE_FIRE_ALL';
    };

@Injectable({
  providedIn: 'root',
})
export class EventBusService {
  private infoEvents$ = new Subject<InfoEvent>();

  constructor() {
    console.log('EventBusService constructor called');

    // window.addEventListener('storage', (event) => {
    //   console.log('storage event', event);
    // });

    // window.addEventListener('message', (event) => {
    //   console.log('message event', event);
    // });

    window.addEventListener('info-event', (event: any) => {
      console.log('info-event', event); //

      const infoEvent = event as InfoEvent;

      console.log('info event: ', infoEvent);
    });
  }

  emitInfoEvent(infoEvent: InfoEvent) {
    this.infoEvents$.next(infoEvent);
  }

  selectEmployeeEvent(id: number) {
    const event: InfoEvent = {
      type: 'EMPLOYEE_SELECTED',
      payload: {
        employeeId: id,
      },
    };
    this.emitInfoEvent(event);
    this.broadCastInfoEvents(event);
  }

  removeEmployeeEvent(id: number) {
    const event: InfoEvent = {
      type: 'EMPLOYEE_REMOVED',
      payload: {
        employeeId: id,
      },
    };
    this.emitInfoEvent(event);
    this.broadCastInfoEvents(event);
  }

  fireAllEmployeesEvent() {
    const event: InfoEvent = {
      type: 'EMPLOYEE_FIRE_ALL',
    };
    this.emitInfoEvent(event);
    this.broadCastInfoEvents(event);
  }

  broadCastInfoEvents(infoEvent: InfoEvent) {
    window.dispatchEvent(new CustomEvent('info-event', { detail: infoEvent }));
  }
}

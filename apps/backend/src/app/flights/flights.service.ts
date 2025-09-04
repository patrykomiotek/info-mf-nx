import { Injectable } from '@nestjs/common';
import { faker } from '@faker-js/faker';

import { FlightDto } from '@info-mf-nx/contracts';

@Injectable()
export class FlightsService {
  private flights: FlightDto[] = [
    {
      id: faker.number.int(),
      name: `${faker.location.city()} - ${faker.location.city()}`,
      description: faker.lorem.sentence(),
      price: faker.number.int({ min: 10, max: 1000 }),
    },
    {
      id: faker.number.int(),
      name: `${faker.location.city()} - ${faker.location.city()}`,
      description: faker.lorem.sentence(),
      price: faker.number.int({ min: 10, max: 1000 }),
    },
    {
      id: faker.number.int(),
      name: `${faker.location.city()} - ${faker.location.city()}`,
      description: faker.lorem.sentence(),
      price: faker.number.int({ min: 10, max: 1000 }),
    },
  ];

  getFlights() {
    return this.flights;
  }

  getFlightById(id: number) {
    return this.flights.find((flight) => flight.id === id);
  }
}

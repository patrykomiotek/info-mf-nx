import { Injectable } from '@nestjs/common';
import { faker } from '@faker-js/faker';

import { EmployeeDto } from '@info-mf-nx/contracts';

@Injectable()
export class EmployeesService {
  private employees: EmployeeDto[] = [
    {
      id: faker.number.int(),
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      salary: faker.number.int({ min: 10, max: 1000 }),
    },
    {
      id: faker.number.int(),
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      salary: faker.number.int({ min: 10, max: 1000 }),
    },
    {
      id: faker.number.int(),
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      salary: faker.number.int({ min: 10, max: 1000 }),
    },
    {
      id: faker.number.int(),
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      salary: faker.number.int({ min: 10, max: 1000 }),
    },
  ];

  getEmployees() {
    return this.employees;
  }

  getEmployeeById(id: number) {
    return this.employees.find((flight) => flight.id === id);
  }
}

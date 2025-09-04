import { Controller, Get, Param } from '@nestjs/common';
import { EmployeesService } from './employees.service';

@Controller('employees') // http://localhost:3002/api/flights
export class EmployeesController {
  constructor(private readonly employeesService: EmployeesService) {}

  @Get() // http://localhost:3002/api/employees
  getEmployees() {
    return this.employeesService.getEmployees();
  }

  @Get(':id') // http://localhost:3002/api/employees/1
  getEmployeesById(@Param('id') id: string) {
    return this.employeesService.getEmployeeById(+id);
  }
}

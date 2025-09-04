import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FlightsModule } from './flights/flights.module';
import { EmployeesModule } from './employees/employees.module';
@Module({
  imports: [FlightsModule, EmployeesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

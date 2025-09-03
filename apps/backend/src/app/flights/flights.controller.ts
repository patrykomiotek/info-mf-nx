import { Controller, Get, Param } from '@nestjs/common';
import { FlightsService } from './flights.service';

@Controller('flights') // http://localhost:3002/api/flights
export class FlightsController {
  constructor(private readonly flightsService: FlightsService) {}

  @Get() // http://localhost:3002/api/flights
  getFlights() {
    return this.flightsService.getFlights();
  }

  @Get(':id') // http://localhost:3002/api/flights/1
  getFlightById(@Param('id') id: string) {
    return this.flightsService.getFlightById(+id);
  }
}

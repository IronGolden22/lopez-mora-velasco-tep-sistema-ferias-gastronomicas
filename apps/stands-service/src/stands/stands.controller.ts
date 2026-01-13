import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { StandsService } from './stands.service';
import { CreateStandDto } from './dto/create-stand.dto';

@Controller('stands')
export class StandsController {
  constructor(private readonly standsService: StandsService) {}

  @Post()
  create(@Body() createStandDto: CreateStandDto) {
    return this.standsService.create(createStandDto);
  }

  @Get()
  findAll() {
    return this.standsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.standsService.findOne(id);
  }
}
import { Controller, Get, Post, Body, Param, Patch, Delete, ParseUUIDPipe, Query } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { StandsService } from './stands.service';
import { CreateStandDto } from './dto/create-stand.dto';
import { UpdateStandDto } from './dto/update-stand.dto';

@Controller('stands')
export class StandsController {
  constructor(private readonly standsService: StandsService) {}

  // RPC para Productos
  @MessagePattern('validate_stand')
  async validateStand(@Payload() id: string) {
    console.log(`(RPC) Verificando puesto ID: ${id}`);
    try {
      return await this.standsService.findOne(id);
    } catch (e) {
      return null;
    }
  }
  
  @Post()
  create(@Body() createStandDto: CreateStandDto) {
    return this.standsService.create(createStandDto);
  }


  @Get()
  findAll(@Query('status') status?: string) {
    return this.standsService.findAll(status);
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.standsService.findOne(id);
  }

  @Patch(':id') 
  update(@Param('id', ParseUUIDPipe) id: string, @Body() updateStandDto: UpdateStandDto) {
    return this.standsService.update(id, updateStandDto);
  }


  @Patch(':id/approve')
  approve(@Param('id', ParseUUIDPipe) id: string) {
    return this.standsService.approveStand(id);
  }

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.standsService.remove(id);
  }
}
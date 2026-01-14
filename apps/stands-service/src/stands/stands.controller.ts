import { Controller, Get, Post, Body, Param, Patch, Delete, ParseUUIDPipe } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices'; // 👈 Importante
import { StandsService } from './stands.service';
import { CreateStandDto } from './dto/create-stand.dto';
import { UpdateStandDto } from './dto/update-stand.dto';

@Controller('stands')
export class StandsController {
  constructor(private readonly standsService: StandsService) {}

  //.
  @MessagePattern({ cmd: 'validate_stand' })
  async validateStand(@Payload() data: { id: string }) {
    console.log(`(RPC) Verificando puesto ID: ${data.id}`);
    const stand = await this.standsService.findOne(data.id);

    return stand; 
  }
  //.
  
  @Post()
  create(@Body() createStandDto: CreateStandDto) {
    return this.standsService.create(createStandDto);
  }

  @Get()
  findAll() {
    return this.standsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.standsService.findOne(id);
  }

  @Patch(':id') 
  update(@Param('id', ParseUUIDPipe) id: string, @Body() updateStandDto: UpdateStandDto) {
    return this.standsService.update(id, updateStandDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.standsService.remove(id);
  }
}
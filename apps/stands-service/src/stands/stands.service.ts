import { Inject, Injectable, Logger, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { Stand } from './entities/stand.entity';
import { CreateStandDto } from './dto/create-stand.dto';
import { UpdateStandDto } from './dto/update-stand.dto';

@Injectable()
export class StandsService {
  private readonly logger = new Logger(StandsService.name);

  constructor(
    @InjectRepository(Stand)
    private readonly standRepository: Repository<Stand>,
    @Inject('USERS_SERVICE') private readonly usersClient: ClientProxy,
  ) {}

  async create(createStandDto: CreateStandDto) {
    const { ownerId } = createStandDto;
    this.logger.log(`Validando dueño ID: ${ownerId}...`);

    try {
      const user = await firstValueFrom(
        this.usersClient.send('validate_user', ownerId) 
      );

      if (!user || !user.id || user.id !== ownerId) {
        throw new Error('User not found');
      }

      this.logger.log(`✅ Dueño validado: ${user.email}`);
      
      const newStand = this.standRepository.create(createStandDto);
      return await this.standRepository.save(newStand);
      
    } catch (error) {
      this.logger.error(`Validación fallida para: ${ownerId}`);
      throw new HttpException('El usuario no existe o está inactivo', HttpStatus.NOT_FOUND);
    }
  }

  async findAll() { return this.standRepository.find(); }

  async findOne(id: string) { return this.standRepository.findOneBy({ id }); }

  async update(id: string, dto: UpdateStandDto) { return this.standRepository.update(id, dto); }
  
  async remove(id: string) { return this.standRepository.delete(id); }
}
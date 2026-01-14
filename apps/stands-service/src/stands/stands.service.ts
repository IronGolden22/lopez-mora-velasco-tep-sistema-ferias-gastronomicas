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
      // 1. Validar usuario en microservicio Users
      const user = await firstValueFrom(
        this.usersClient.send('validate_user', ownerId) 
      );

      if (!user) throw new Error('User not found');

      // 2. Validar ROL: Solo EMPRENDEDOR puede crear
      if (user.role !== 'EMPRENDEDOR') {
         this.logger.warn(`Intento de creación por rol no autorizado: ${user.role}`);
         throw new HttpException('Solo los emprendedores pueden crear puestos.', HttpStatus.FORBIDDEN);
      }

      this.logger.log(`Dueño validado: ${user.email}`);
      
      const newStand = this.standRepository.create({
        ...createStandDto,
        status: 'PENDIENTE' 
      });
      return await this.standRepository.save(newStand);
      
    } catch (error) {
      if (error instanceof HttpException) throw error;
      this.logger.error(`Validación fallida para: ${ownerId}`);
      throw new HttpException('El usuario no existe o no es válido', HttpStatus.NOT_FOUND);
    }
  }

  // Aquí está el filtro de status que necesita el Catálogo
  async findAll(status?: string) { 
    const where: any = {};
    if (status) {
      where.status = status;
    }
    return this.standRepository.find({ where }); 
  }

  async findOne(id: string) { 
    return this.standRepository.findOneBy({ id }); 
  }

  async update(id: string, dto: UpdateStandDto) { 
    await this.standRepository.update(id, dto);
    return this.findOne(id);
  }
  
  async remove(id: string) { 
    return this.standRepository.delete(id); 
  }

  async approveStand(id: string) {
    const stand = await this.findOne(id);
    if (!stand) throw new HttpException('Puesto no encontrado', HttpStatus.NOT_FOUND);

    stand.status = 'ACTIVO'; 
    this.logger.log(`Puesto aprobado: ${stand.name}`);
    return this.standRepository.save(stand);
  }
}
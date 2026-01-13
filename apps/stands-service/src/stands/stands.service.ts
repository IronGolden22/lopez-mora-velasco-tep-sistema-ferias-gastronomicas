import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateStandDto } from './dto/create-stand.dto';
import { Stand } from './entities/stand.entity';

@Injectable()
export class StandsService {
  constructor(
    @InjectRepository(Stand)
    private readonly standRepository: Repository<Stand>,
  ) {}

  // Crear un puesto (Guardar en BD)
  async create(createStandDto: CreateStandDto) {
    const newStand = this.standRepository.create(createStandDto);
    return await this.standRepository.save(newStand);
  }

  // Listar todos (Leer de BD)
  async findAll() {
    return await this.standRepository.find();
  }

  // Buscar uno por ID
  async findOne(id: string) {
    return await this.standRepository.findOneBy({ id });
  }
}
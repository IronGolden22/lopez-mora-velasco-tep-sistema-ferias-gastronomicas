import { Inject, Injectable, Logger, HttpException, HttpStatus } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class ProductsService {
  private readonly logger = new Logger(ProductsService.name);

  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @Inject('STANDS_SERVICE') private readonly standsClient: ClientProxy,
  ) {}

  async create(createProductDto: CreateProductDto) {
    const { standId } = createProductDto;

    this.logger.log(`Validando si el puesto ${standId} existe...`);

    try {
      const stand = await firstValueFrom(
        this.standsClient.send({ cmd: 'validate_stand' }, { id: standId })
      );

      if (!stand) {
        throw new Error('Puesto no encontrado');
      }
      
      this.logger.log(`Puesto confirmado: ${stand.name}`);

    } catch (error) {
      this.logger.error(`Error validando puesto: ${standId}`);
      throw new HttpException('El puesto no existe o no es válido', HttpStatus.NOT_FOUND);
    }

    const newProduct = this.productRepository.create(createProductDto);
    return await this.productRepository.save(newProduct);
  }

  findAll() { return this.productRepository.find(); }

  findOne(id: string) { return this.productRepository.findOneBy({ id }); }

  update(id: string, dto: UpdateProductDto) { return this.productRepository.update(id, dto); }

  remove(id: string) { return this.productRepository.delete(id); }
}
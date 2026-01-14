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
      // 👇 Usamos string plano para coincidir con StandsController
      const stand = await firstValueFrom(
        this.standsClient.send('validate_stand', standId)
      );

      if (!stand) {
        throw new Error('Puesto no encontrado');
      }
      
      this.logger.log(`✅ Puesto confirmado: ${stand.name}`);

    } catch (error) {
      this.logger.error(`❌ Error validando puesto: ${standId}`);
      throw new HttpException('El puesto no existe o no es válido', HttpStatus.NOT_FOUND);
    }

    const newProduct = this.productRepository.create(createProductDto);
    return await this.productRepository.save(newProduct);
  }

  async findAll() { 
    return await this.productRepository.find(); 
  }

  async findOne(id: string) { 
    // Aseguramos que el findOne devuelva todo lo necesario para la validación de stock
    const product = await this.productRepository.findOneBy({ id });
    if (!product) throw new HttpException('Producto no encontrado', HttpStatus.NOT_FOUND);
    return product;
  }

  async update(id: string, dto: UpdateProductDto) { 
    await this.productRepository.update(id, dto); 
    return this.findOne(id);
  }

  async remove(id: string) { 
    await this.productRepository.delete(id); 
    return { deleted: true };
  }
}
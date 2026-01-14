import { Test, TestingModule } from '@nestjs/testing';
import { StandsController } from './stands.controller';
import { StandsService } from './stands.service';

describe('StandsController', () => {
  let controller: StandsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StandsController],
      providers: [StandsService],
    }).compile();

    controller = module.get<StandsController>(StandsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

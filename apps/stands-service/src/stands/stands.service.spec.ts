import { Test, TestingModule } from '@nestjs/testing';
import { StandsService } from './stands.service';

describe('StandsService', () => {
  let service: StandsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [StandsService],
    }).compile();

    service = module.get<StandsService>(StandsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

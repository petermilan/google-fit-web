import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { FitnessApiService } from './fitness-api.service';

describe('FitnessApiService', () => {
  let service: FitnessApiService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn(() => 'foobar'),
          },
        },
        FitnessApiService,
      ],
    }).compile();

    service = module.get<FitnessApiService>(FitnessApiService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

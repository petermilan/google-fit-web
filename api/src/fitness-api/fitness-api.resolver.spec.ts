import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { FitnessApiResolver } from './fitness-api.resolver';
import { FitnessApiService } from './fitness-api.service';

describe('FitnessApiResolver', () => {
  let resolver: FitnessApiResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FitnessApiResolver,
        FitnessApiService,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn(() => 'foobar'),
          },
        },
      ],
    }).compile();

    resolver = module.get<FitnessApiResolver>(FitnessApiResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});

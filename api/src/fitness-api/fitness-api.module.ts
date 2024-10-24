import { Module } from '@nestjs/common';
import { FitnessApiService } from './fitness-api.service';
import { FitnessApiResolver } from './fitness-api.resolver';

@Module({
  providers: [FitnessApiResolver, FitnessApiService, ],
})
export class FitnessApiModule {}

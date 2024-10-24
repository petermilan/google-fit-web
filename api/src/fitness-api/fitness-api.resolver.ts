import { Resolver, Query, Context, Args } from '@nestjs/graphql';
import { FitnessApiService } from './fitness-api.service';

const extractTokenFromHeaders = (headers: { authorization: string }) => {
  return headers?.authorization?.split(' ')?.[1];
}
@Resolver('FitnessApi')
export class FitnessApiResolver {
  constructor(private readonly fitnessApiService: FitnessApiService) {}


  @Query('getWeightData')
  getWeightData(@Context() context) {
    const { headers } = context.req;
    return this.fitnessApiService.getWeightData(extractTokenFromHeaders(headers));
  }
  @Query('getAuthUrl')
  getAuthUrl() {
    return { url: this.fitnessApiService.generateAuthUrl() };
  }
  @Query('getAuthCodeToken')
  async getAuthCodeToken(
    @Args('payload') payload: { code: string },
  ) {
    const token = await this.fitnessApiService.getToken(payload.code);
    return {
      token: token,
    };
  }

}

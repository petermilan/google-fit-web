import { Resolver, Query, Context, Args } from '@nestjs/graphql';
import { FitnessApiService } from './fitness-api.service';

const extractTokenFromHeaders = (headers: { authorization: string }) => {
  return headers?.authorization?.split(' ')?.[1];
}
@Resolver('FitnessApi')
export class FitnessApiResolver {
  constructor(private readonly fitnessApiService: FitnessApiService) {}


  @Query('getWeightData')
  getWeightData(
    @Context() context,
    @Args('payload') payload: {
      startTimeMillis: Date,
      endTimeMillis: Date,
      type: string,
      value: number,
    },
  ) {
    const { headers } = context.req;
    const now = new Date();
    return this.fitnessApiService.getWeightData(
      extractTokenFromHeaders(headers),
      payload?.startTimeMillis ?? new Date(now.getFullYear(), now.getMonth() -1, 1),
      payload?.endTimeMillis ?? now,
      payload?.type ?? 'day',
      payload?.value ?? 1,
    );
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

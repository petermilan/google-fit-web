import { google } from 'googleapis';
import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';

const  WEIGHT_DATA_TYPE_NAME = 'com.google.weight.summary';
const  WEIGHT_DATASOURCE_ID = 'derived:com.google.weight:com.google.android.gms:merge_weight';

const GOOGLE_SCOPE = 'https://www.googleapis.com/auth/fitness.activity.read https://www.googleapis.com/auth/fitness.activity.write https://www.googleapis.com/auth/fitness.blood_glucose.read https://www.googleapis.com/auth/fitness.blood_glucose.write https://www.googleapis.com/auth/fitness.blood_pressure.read https://www.googleapis.com/auth/fitness.blood_pressure.write https://www.googleapis.com/auth/fitness.body.read https://www.googleapis.com/auth/fitness.body.write https://www.googleapis.com/auth/fitness.body_temperature.read https://www.googleapis.com/auth/fitness.body_temperature.write https://www.googleapis.com/auth/fitness.heart_rate.read https://www.googleapis.com/auth/fitness.heart_rate.write https://www.googleapis.com/auth/fitness.location.read https://www.googleapis.com/auth/fitness.location.write https://www.googleapis.com/auth/fitness.nutrition.read https://www.googleapis.com/auth/fitness.nutrition.write https://www.googleapis.com/auth/fitness.oxygen_saturation.read https://www.googleapis.com/auth/fitness.oxygen_saturation.write https://www.googleapis.com/auth/fitness.reproductive_health.read https://www.googleapis.com/auth/fitness.reproductive_health.write https://www.googleapis.com/auth/fitness.sleep.read https://www.googleapis.com/auth/fitness.sleep.write';

const dataSourceIdToLabel = (dataSourceId) => {
  return dataSourceId.split('com.google.')[1].replace(':', '');
}

const { OAuth2 } = google.auth;
@Injectable()
export class FitnessApiService {
  private oAuth2Client: InstanceType<typeof OAuth2>;
  constructor(
    private configService: ConfigService,
  ) {
    this.oAuth2Client = new OAuth2(
      this.configService.get('google.clientId'),
      this.configService.get('google.clientSecret'),
      this.configService.get('google.redirectUri'),
    );
  }

  generateAuthUrl() {
    return this.oAuth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: GOOGLE_SCOPE
    });
  }

  async getToken(code: string) {
    const { tokens } = await this.oAuth2Client.getToken(code);
    return tokens.access_token;
  }

  async getWeightData(token: string) {
    const date = new Date();
    this.oAuth2Client.setCredentials({ access_token: token });
    const fitnessStore = google.fitness({
      version: 'v1',
      auth: this.oAuth2Client,
    });

    const requestBody = {
      aggregateBy: [{
        dataTypeName: WEIGHT_DATA_TYPE_NAME,
        dataSourceId: WEIGHT_DATASOURCE_ID,
      }],
      bucketByTime: {
        period: {
          type: 'day',
          value: 1,
          timeZoneId: 'UTC'
        },
      },
      startTimeMillis: String(new Date(date.getFullYear(), date.getMonth() -1, 1).getTime()),
      endTimeMillis: String(Date.now()),
    };
    const result = await fitnessStore.users.dataset.aggregate({
      userId: 'me',
      requestBody,
    });
    const data = result?.data?.bucket?.map((row) => {
      return {
        date: new Date(Number(row?.startTimeMillis)).toDateString(),
        name: dataSourceIdToLabel(row?.dataset?.[0].dataSourceId),
        value: row?.dataset?.[0]?.point?.[0]?.value?.[0]?.fpVal,
      }
    });
    return data;
  }
}

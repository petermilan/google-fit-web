import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { ConfigModule } from '@nestjs/config';
import { FitnessApiModule } from './fitness-api/fitness-api.module';
import configuration from './config/configuration';
import { resolvers as scalarResolvers } from 'graphql-scalars';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      isGlobal: true,
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      typePaths: ['./**/*.graphql'],
      resolvers: {
        JSON: scalarResolvers.JSON,
      },
    }),
    FitnessApiModule,
  ],
  providers: [AppService],
})
export class AppModule {}

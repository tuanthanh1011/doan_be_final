import { Module } from '@nestjs/common';
import { MinioModule } from 'nestjs-minio-client';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MinioClientService } from './minio-client.service';

@Module({
  imports: [
    ConfigModule,
    MinioModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return {
          endPoint: configService.get<string>('MINIO_ENDPOINT'),
          port: +configService.get<string>('MINIO_PORT'),
          useSSL: false,
          accessKey: configService.get<string>('MINIO_ACCESS_KEY'),
          secretKey: configService.get<string>('MINIO_SECRET_KEY'),
        };
      },
    }),
  ],
  providers: [MinioClientService],
  exports: [MinioClientService],
})
export class MinioClientModule {}

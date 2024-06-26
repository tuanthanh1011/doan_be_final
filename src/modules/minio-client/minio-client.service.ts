import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MinioService } from 'nestjs-minio-client';

@Injectable()
export class MinioClientService {
  constructor(
    private minioService: MinioService,
    private configService: ConfigService,
  ) {}

  async uploadFile(file: Express.Multer.File, bucketName) {
    const { originalname } = file;
    const fileName = Date.now() + '_' + originalname;

    await this.minioService.client.putObject(
      bucketName,
      fileName,
      file.buffer,
      {
        'Content-Type': file.mimetype,
      },
    );

    const urlImage = this.generateFileUrl(fileName, bucketName);
    return urlImage;
  }

  async deleteFile(fileName: string, bucketName) {
    await this.minioService.client.removeObject(bucketName, fileName);
  }

  generateFileUrl(fileName: string, bucketName): string {
    const urlImage = `${bucketName}/${fileName}`;
    return urlImage;
  }
}

import { Injectable, OnModuleInit } from '@nestjs/common';
import { Client } from 'minio';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MinioService implements OnModuleInit {
  private client: Client;
  private bucket: string;

  constructor(private config: ConfigService) {
    this.client = new Client({
      endPoint: this.config.get<string>('MINIO_ENDPOINT', 'localhost'),
         port: parseInt(this.config.get<string>('MINIO_PORT', '9000'), 10), // ép string -> number
         useSSL: false,
      accessKey: this.config.get<string>('MINIO_ACCESS_KEY', 'minioadmin'),
      secretKey: this.config.get<string>('MINIO_SECRET_KEY', 'minioadmin'),
    });

    this.bucket = this.config.get<string>('MINIO_BUCKET', 'uploads');
  }

  async onModuleInit() {
    const exists = await this.client.bucketExists(this.bucket).catch(() => false);
    if (!exists) {
      await this.client.makeBucket(this.bucket);
    }
  }

  async uploadFile(
    name: string,
    buffer: Buffer,
    contentType = 'application/octet-stream',
  ) {
    const objectName = `${Date.now()}-${name}`;
    await this.client.putObject(this.bucket, objectName, buffer, {
      'Content-Type': contentType,
    });
    return `${this.bucket}/${objectName}`;
  }

  async getSignedUrl(path: string) {
    const [bucket, ...rest] = path.split('/');
    const objectName = rest.join('/');
    return this.client.presignedGetObject(bucket, objectName, 60 * 60);
  }

}

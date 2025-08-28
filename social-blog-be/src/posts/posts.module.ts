import { Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { MinioModule } from '../minio/minio.module';

@Module({ imports: [PrismaModule, MinioModule], providers: [PostsService], controllers: [PostsController] })
export class PostsModule {}

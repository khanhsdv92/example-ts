import { Controller, Post, UseGuards, UploadedFile, UseInterceptors, Body, Req, Get, Param, Delete, Put, Logger } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { PostsService } from './posts.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { MinioService } from 'src/minio/minio.service';

@Controller('posts')
export class PostsController {
    private readonly logger = new Logger(PostsController.name); // Tạo logger riêng cho controller

  constructor(private minio: MinioService, private posts: PostsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async create(@UploadedFile() file: Express.Multer.File, @Body() body: any, @Req() req: any) {
    try {
      console.log('Request User:', req.user); // Debug the user object
      let imagePath: string | undefined = undefined;
      if (file) {
         console.log('R222:', req.user); // Debug the user object
        const res = await this.minio.uploadFile(file.originalname, file.buffer, file.mimetype);
        imagePath = res;
      }
       console.log('Re3333 User:', req.user); // Debug the user object
      return this.posts.create(req.user.id, { title: body.title, content: body.content, imagePath });
    } catch (error) {
      console.error('Error creating post:', error);
      throw error;
    }
  }

  
// In PostsController
@Get()
async findAll() {
  const posts = await this.posts.findAll();
  // Convert image paths to presigned URLs
  this.logger.log('Fetching all posts');
  return Promise.all(posts.map(async (post) => {
    if (post.imagePath) {
      console.log('Post Image Path:', post.imagePath);

      return {
        ...post,
        imageUrl: await this.minio.getSignedUrl(post.imagePath)
      };
    }
    return post;
  }));
}

@Get(':id')
async findOne(@Param('id') id: string) {
  const post = await this.posts.findOne(Number(id));
  if (post && post.imagePath) {
    return {
      ...post,
      imageUrl: await this.minio.getSignedUrl(post.imagePath)
    };
  }
  return post;
}

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  update(@Param('id') id: string, @Body() body: any) {
    return this.posts.update(Number(id), body);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.posts.remove(Number(id));
  }
}
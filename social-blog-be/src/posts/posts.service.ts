import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PostsService {
  constructor(private prisma: PrismaService) {}

  async create(authorId: number, data: { title: string; content?: string; imagePath?: string }) {
    return this.prisma.post.create({ data: { ...data, authorId } });
  }

  async findAll() {
    return this.prisma.post.findMany({ include: { author: true } });
  }

  async findOne(id: number) {
    return this.prisma.post.findUnique({ where: { id } });
  }

  async update(id: number, data: any) {
    return this.prisma.post.update({ where: { id }, data });
  }

  async remove(id: number) {
    return this.prisma.post.delete({ where: { id } });
  }
}
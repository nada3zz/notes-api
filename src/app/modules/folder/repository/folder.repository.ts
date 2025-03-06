// src/repositories/folder.repository.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/app/shared/prisma';
import { Folder, Prisma } from '@prisma/client';

@Injectable()
export class FolderRepository {
  constructor(private prisma: PrismaService) {}

  async create(data: Prisma.FolderCreateInput): Promise<Folder> {
    return this.prisma.folder.create({ data });
  }

  async findMany(
    where: Prisma.FolderWhereInput,
    skip?: number,
    take?: number,
    orderBy?: Prisma.FolderOrderByWithRelationInput,
  ): Promise<Folder[]> {
    return this.prisma.folder.findMany({ where, skip, take, orderBy });
  }

  async count(where: Prisma.FolderWhereInput): Promise<number> {
    return this.prisma.folder.count({ where });
  }

  async findUnique(where: Prisma.FolderWhereUniqueInput): Promise<Folder | null> {
    return this.prisma.folder.findUnique({ where });
  }

  async update(where: Prisma.FolderWhereUniqueInput, data: Prisma.FolderUpdateInput): Promise<Folder> {
    return this.prisma.folder.update({ where, data });
  }

  async delete(where: Prisma.FolderWhereUniqueInput): Promise<Folder> {
    return this.prisma.folder.delete({ where });
  }

  async exists(where: Prisma.FolderWhereInput): Promise<boolean> {
    const count = await this.prisma.folder.count({ where });
    return count > 0;
  }
}
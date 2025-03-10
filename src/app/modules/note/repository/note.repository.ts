import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/app/shared/prisma';
import { Note, Prisma } from '@prisma/client';

@Injectable()
export class NoteRepository {
  constructor(private prismaService: PrismaService) {}

  async create(
    data: Prisma.NoteCreateInput,
    prisma?: Prisma.TransactionClient,
  ): Promise<Note> {
    const client = prisma || this.prismaService;
    return client.note.create({ data });
  }

  async findMany(
    where: Prisma.NoteWhereInput,
    skip?: number,
    take?: number,
    orderBy?: Prisma.NoteOrderByWithRelationInput,
  ): Promise<Note[]> {
    return this.prismaService.note.findMany({
      where,
      skip,
      take,
      orderBy,
      include: { textNote: true, listNote: true },
    });
  }

  async count(where: Prisma.NoteWhereInput): Promise<number> {
    return this.prismaService.note.count({ where });
  }

  async findUnique(where: Prisma.NoteWhereUniqueInput): Promise<Note | null> {
    return this.prismaService.note.findUnique({
      where,
      include: { textNote: true, listNote: true },
    });
  }

  async update(
    where: Prisma.NoteWhereUniqueInput,
    data: Prisma.NoteUpdateInput,
    prisma?: Prisma.TransactionClient,
  ): Promise<Note> {
    const client = prisma || this.prismaService;
    return client.note.update({ where, data });
  }

  async delete(where: Prisma.NoteWhereUniqueInput): Promise<Note> {
    return this.prismaService.note.delete({ where });
  }

  async exists(where: Prisma.NoteWhereInput): Promise<boolean> {
    const count = await this.prismaService.note.count({ where });
    return count > 0;
  }

  async filter(folderId: number, userId: number) {
    return this.prismaService.note.findMany({
      where: {
        userId, 
        folderId, 
      },
      include: {
        textNote: true,
        listNote: true,
      },
    });
  }

  async search(keyword: string, userId: number) {
    return this.prismaService.note.findMany({
      where: {
        AND: [
          { userId },
          {
            OR: [
              { title: { contains: keyword, mode: 'insensitive' } },
              {
                textNote: {
                  content: { contains: keyword, mode: 'insensitive' },
                },
              },
              {
                listNote: {
                  items: { path: ['items'], array_contains: [keyword] },
                },
              },
            ],
          },
        ],
      },
      include: {
        textNote: true,
        listNote: true,
      },
    });
  }
}

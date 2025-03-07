import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/app/shared/prisma';
import { ListNote, Prisma } from '@prisma/client';


@Injectable()
export class ListNoteRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create( items: any, noteId: number , prisma?: Prisma.TransactionClient): Promise<ListNote> {
    const client = prisma || this.prisma;
    return client.listNote.create({ data : { items, noteId } });
  }

  async findByNoteId(noteId: number): Promise<ListNote | null> {
    return this.prisma.listNote.findUnique({ where: { noteId } });
  }

  async update(noteId: number, items: any, prisma?: Prisma.TransactionClient): Promise<ListNote> {
    const client = prisma || this.prisma;
    return client.listNote.update({ where: { noteId }, data: { items } });
  }

}


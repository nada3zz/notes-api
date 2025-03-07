import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/app/shared/prisma';
import { TextNote, Prisma } from '@prisma/client';

@Injectable()
export class TextNoteRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(content: string, noteId: number , prisma?: Prisma.TransactionClient): Promise<TextNote> {
    const client = prisma || this.prisma;
    return client.textNote.create({ data: { content, noteId } });
  }

  async findByNoteId(noteId: number): Promise<TextNote | null> {
    return this.prisma.textNote.findUnique({ where: { noteId } });
  }

  async update(noteId: number, content: string, prisma?: Prisma.TransactionClient): Promise<TextNote> {
    const client = prisma || this.prisma;
    return client.textNote.update({ where: { noteId } , data : {content} });
  }
}
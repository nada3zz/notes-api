import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { CreateNoteDto, UpdateNoteDto } from '../dtos';
import { ErrorMessagesMapping } from 'src/app/shared/Enums/error-messages-mapping';
import {
  NoteRepository,
  TextNoteRepository,
  ListNoteRepository,
} from './../repository';
import { NoteTypeEnum } from '../Enums/note-type';
import { PrismaService } from 'src/app/shared/prisma';
import { Prisma } from '@prisma/client';

@Injectable()
export class NoteService {
  constructor(
    private readonly noteRepository: NoteRepository,
    private readonly textNoteRepo: TextNoteRepository,
    private readonly listNoteRepo: ListNoteRepository,
    private readonly prisma: PrismaService,
  ) {}

  async createNote(noteDto: CreateNoteDto, userId: number) {
    return this.prisma.$transaction(async (prisma) => {
      const note = await this.noteRepository.create(
        {
          title: noteDto.title,
          type: noteDto.type,
          folder: { connect: { id: noteDto.folderId } },
          user: { connect: { id: userId } },
        },
        prisma,
      );

      if (noteDto.type === NoteTypeEnum.TEXT) {
        await this.textNoteRepo.create(noteDto.textNote, note.id, prisma);
      } else if (noteDto.type === NoteTypeEnum.LIST) {
        await this.listNoteRepo.create(
          { items: noteDto.listNote },
          note.id,
          prisma,
        );
      }
      return note;
    });
  }

  async getAllNotes(
    userId: number,
    page: number,
    limit: number,
    order: Prisma.SortOrder = 'asc',
  ) {
    if (!page || !limit) limit = 5;
    page = 1;

    const skip = (page - 1) * limit;
    const where = { userId };

    const notes = await this.noteRepository.findMany(where, skip, limit, {
      createdAt: order,
    });

    const notesCount = await this.noteRepository.count(where);

    const totalPages = Math.ceil(notesCount / limit);

    return {
      data: notes,
      pagination: {
        notesCount,
        totalPages,
        currentPage: page,
        itemsPerPage: limit,
      },
    };
  }

  async getNote(id: number, userId: number) {
    const note = await this.noteRepository.findUnique({ id });

    if (!note) {
      throw new NotFoundException(ErrorMessagesMapping.Note_Not_Found);
    }

    if (note.userId !== userId) {
      throw new ForbiddenException(ErrorMessagesMapping.Forbidden_Note);
    }

    return note;
  }

  async updateNote(noteDto: UpdateNoteDto, id: number, userId: number) {
    const note = await this.noteRepository.findUnique({ id });

    if (!note) {
      throw new NotFoundException(ErrorMessagesMapping.Note_Not_Found);
    }

    if (note.userId !== userId) {
      throw new ForbiddenException(ErrorMessagesMapping.Forbidden_Note);
    }

    return this.prisma.$transaction(async (prisma) => {
      const updatedNote = await this.noteRepository.update(
        { id },
        {
          title: noteDto.title,
          folder: { connect: { id: noteDto.folderId } },
        },
        prisma,
      );

      if (note.type === NoteTypeEnum.TEXT && noteDto.textNote) {
        await this.textNoteRepo.update(id, noteDto.textNote, prisma);
      } else if (note.type === NoteTypeEnum.LIST && noteDto.listNote) {
        await this.listNoteRepo.update(
          id,
          {
            items: noteDto.listNote,
          },
          prisma,
        );
      }
      return updatedNote;
    });
  }

  async deleteNote(id: number, userId: number) {
    if (!id) {
      throw new BadRequestException(ErrorMessagesMapping.Note_Id_Required);
    }

    const note = await this.noteRepository.findUnique({ id });

    if (!note) {
      throw new NotFoundException(ErrorMessagesMapping.Note_Not_Found);
    }

    if (note.userId !== userId) {
      throw new ForbiddenException(ErrorMessagesMapping.Forbidden_Note);
    }

    await this.noteRepository.delete({ id });
    return { message: 'Note have been deleted successfully' };
  }
  
  async filterNotes(
    folderId?: number,
    userId?: number,
  ) {
    return await this.noteRepository.filter(folderId, userId);
  }
}

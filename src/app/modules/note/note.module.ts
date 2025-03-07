import { Module } from '@nestjs/common';
import { NoteController } from './controller/note.controller';
import { NoteService } from './service/note.service';
import { NoteRepository, TextNoteRepository, ListNoteRepository } from './repository';
import { PrismaModule } from 'src/app/shared/prisma';

@Module({
  imports: [PrismaModule],
  controllers: [NoteController],
  providers: [NoteService, NoteRepository,TextNoteRepository, ListNoteRepository],
})
export class NoteModule {}

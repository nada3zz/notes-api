import {
  Controller,
  Get,
  Query,
  Post,
  Body,
  Req,
  Patch,
  UseGuards,
  Param,
  Delete,
} from '@nestjs/common';
import { AccessTokenGuard } from 'src/app/shared/guards/access-token.guard';
import { NoteService } from '../service/note.service';
import { CreateNoteDto, UpdateNoteDto } from '../dtos';

@Controller('note')
export class NoteController {
  constructor(private noteService: NoteService) {}

  @Post()
  @UseGuards(AccessTokenGuard)
  async createNote(@Body() body: CreateNoteDto, @Req() req: Request) {
    const userId = req['user']['id'];
    return await this.noteService.createNote(body, userId);
  }

  @UseGuards(AccessTokenGuard)
  @Get()
  async getAllnotes(
    @Req() req: Request,
    @Query('page') page: number,
    @Query('limit') limit: number,
  ) {
    const userId = req['user']['id'];
    return await this.noteService.getAllNotes(userId, +page, +limit);
  }

  @UseGuards(AccessTokenGuard)
  @Get('/:id')
  async getNote(@Param('id') id: string, @Req() req: Request) {
    const userId = req['user']['id'];
    return await this.noteService.getNote(+id, userId);
  }

  @UseGuards(AccessTokenGuard)
  @Patch('/:id')
  async updateNote(
    @Param('id') id: number,
    @Body() body: UpdateNoteDto,
    @Req() req: Request,
  ) {
    const userId = req['user']['id'];
    return await this.noteService.updateNote(body, +id, userId);
  }

  @UseGuards(AccessTokenGuard)
  @Delete('/:id')
  async deleteNote(@Param('id') id: string, @Req() req: Request) {
    const userId = req['user']['id'];
    await this.noteService.deleteNote(parseInt(id), userId);
  }
}

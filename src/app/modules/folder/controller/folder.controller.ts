import { Controller, Get, Query, Post, Body, Req, Patch, UseGuards, Param, Delete } from '@nestjs/common';
import { FolderService } from '../service/folder.service';
import { CreateFolderDto } from '../dtos';
import { AccessTokenGuard } from 'src/app/shared/guards/access-token.guard';

@Controller('folder')
export class FolderController {
    constructor( private folderService: FolderService) {}

    @Post()
    @UseGuards(AccessTokenGuard)
    async createFolder(@Body() body: CreateFolderDto, @Req() req: Request ) {
        const userId = req['user']['id'];
        return await this.folderService.createFolder(body, userId);
    }

    @UseGuards(AccessTokenGuard)
    @Get()
    async getAllFolders(@Req() req: Request, @Query('page') page: number, @Query('limit') limit: number) {
        const userId = req['user']['id'];
        return await this.folderService.getAllFolders(userId, +page, +limit);
    }

    @UseGuards(AccessTokenGuard)
    @Get('/:id')
    async getFolder(@Param('id') id: string, @Req() req: Request) {
        const userId = req['user']['id'];
       return await this.folderService.getFolder(parseInt(id), userId);
    }

    @UseGuards(AccessTokenGuard)
    @Patch('/:id')
    async updateFolder(@Param('id') id: number, @Body() body: CreateFolderDto, @Req() req: Request) {
       const userId = req['user']['id'];
      return await this.folderService.updateFolder(body, +id, userId);
    }

    @UseGuards(AccessTokenGuard)
    @Delete('/:id')
    async deleteFolder(@Param('id') id: string, @Req() req: Request) {
        const userId = req['user']['id'];
       await this.folderService.deleteFolder(parseInt(id), userId);
    }
}

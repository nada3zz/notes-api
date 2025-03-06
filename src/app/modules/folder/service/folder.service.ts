import { BadRequestException, NotFoundException, ForbiddenException, Injectable } from '@nestjs/common';
import { FolderRepository } from '../repository/folder.repository';
import { CreateFolderDto } from '../dtos';
import { ErrorMessagesMapping } from 'src/app/shared/Enums/error-messages-mapping';
import { Prisma } from '@prisma/client';

@Injectable()
export class FolderService {
  constructor(private readonly folderRepository: FolderRepository) {}
  
  async createFolder(folderDto: CreateFolderDto, userId: number) {
    const { name } = folderDto;

    const folderExists = await this.folderRepository.exists({
      name,
      user_id: userId,
    });

    if (folderExists) {
      throw new BadRequestException(ErrorMessagesMapping.Folder_Already_Exists);
    }

    return this.folderRepository.create({
      ...folderDto,
      user: {
        connect: {
          id: userId,
        },
      },
    });
  }

  async getAllFolders(userId: number, page: number , limit: number, order: Prisma.SortOrder = 'asc') {
    if (!page || !limit ) limit =5; page = 1;

    const skip = (page - 1) * limit;
    const where = { user_id: userId };

    const folders = await this.folderRepository.findMany(where, skip, limit, {createdAt: order});

    const foldersCount = await this.folderRepository.count(where);

    const totalPages = Math.ceil(foldersCount / limit);

    return {
      data: folders,
      pagination: {
        foldersCount,
        totalPages,
        currentPage: page,
        itemsPerPage: limit,
      },
    };
  }

  async getFolder(id: number, userId: number) {
    const folder = await this.folderRepository.findUnique({ id });

    if (!folder) {
      throw new NotFoundException(ErrorMessagesMapping.Folder_Not_Found);
    }

    if (folder.user_id !== userId) {
      throw new ForbiddenException(ErrorMessagesMapping.Forbidden_Folder);
    }

    return folder;
  }

  async updateFolder({ name }: CreateFolderDto, id: number, userId: number) {
    if (!id) {
      throw new BadRequestException(ErrorMessagesMapping.Folder_Id_Required);
    }

    const folder = await this.folderRepository.findUnique({ id });

    if (!folder) {
      throw new NotFoundException(ErrorMessagesMapping.Folder_Not_Found);
    }

    if (folder.user_id !== userId) {
      throw new ForbiddenException(ErrorMessagesMapping.Forbidden_Folder);
    }

    if (name && name !== folder.name) {
      const folderExists = await this.folderRepository.exists({
        name,
        user_id: userId,
        NOT: {
          id: folder.id,
        },
      });

      if (folderExists) {
        throw new BadRequestException(ErrorMessagesMapping.Folder_Already_Exists);
      }
    }

    return await this.folderRepository.update({ id }, { name });
  }

  async deleteFolder(id: number, userId: number) {
    if (!id) {
      throw new BadRequestException(ErrorMessagesMapping.Folder_Id_Required);
    }

    const folder = await this.folderRepository.findUnique({ id });

    if (!folder) {
      throw new NotFoundException(ErrorMessagesMapping.Folder_Not_Found);
    }

    if (folder.user_id !== userId) {
      throw new ForbiddenException(ErrorMessagesMapping.Forbidden_Folder);
    }

    await this.folderRepository.delete({ id });
    return { message: 'Folder deleted successfully' };
  }
}


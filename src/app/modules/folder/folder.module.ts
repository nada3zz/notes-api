import { Module } from '@nestjs/common';
import { FolderController } from './controller/folder.controller';
import { FolderService } from './service/folder.service';
import { PrismaModule } from '../../shared/prisma/prisma.module';
import { FolderRepository } from './repository/folder.repository';

@Module({
  imports: [PrismaModule],
  controllers: [FolderController],
  providers: [FolderService, FolderRepository],
})
export class FolderModule {}

import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FoldersModule } from './folders/folders.module';

@Module({
  imports: [FoldersModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

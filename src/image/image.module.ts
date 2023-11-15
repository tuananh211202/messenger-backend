import { Module } from '@nestjs/common';
import { ImageController } from './image.controller';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
  controllers: [ImageController]
})
export class ImageModule {}

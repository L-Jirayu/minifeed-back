import { Module } from '@nestjs/common';
import { PostandupService } from './postandup.service';
import { PostandupController } from './postandup.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Postandup, PostandupSchema } from './schemas/postandup.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: Postandup.name, schema: PostandupSchema }])],
  controllers: [PostandupController],
  providers: [PostandupService],
})
export class PostandupModule {}

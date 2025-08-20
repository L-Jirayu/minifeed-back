import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { PostandupService } from './postandup.service';
import { CreatePostandupDto } from './dto/create-postandup.dto';
import { UpdatePostandupDto } from './dto/update-postandup.dto';
import { JwtAuthGuard } from '../auth/jwt-auth-guard';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('postandup')
@UseGuards(JwtAuthGuard)
export class PostandupController {
  constructor(private readonly postandupService: PostandupService) {}

  @Post()
  @UseInterceptors(FileInterceptor('image'))
  create(
    @Body() createPostandupDto: CreatePostandupDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.postandupService.create(createPostandupDto, file);
  }

  @Get()
  findAll() {
    return this.postandupService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.postandupService.findOne(id);
  }

  @Patch(':id')
  @UseInterceptors(FileInterceptor('image'))
  update(
    @Param('id') id: string,
    @Body() updatePostandupDto: UpdatePostandupDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.postandupService.update(id, updatePostandupDto, file);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.postandupService.remove(id);
  }
}

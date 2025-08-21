import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards, Request, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { PostandupService } from './postandup.service';
import { CreatePostandupDto } from './dto/create-postandup.dto';
import { UpdatePostandupDto } from './dto/update-postandup.dto';
import { JwtAuthGuard } from '../auth/jwt-auth-guard';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Controller('postandup')
export class PostandupController {
  constructor(private readonly postService: PostandupService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: (_, file, cb) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, uniqueSuffix + extname(file.originalname));
        },
      }),
    }),
  )
  create(
    @Body() createDto: CreatePostandupDto,
    @Request() req,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    console.log('===== POST /postandup =====');
    console.log('req.user:', req.user); // ตรวจสอบ JWT guard
    console.log('body:', createDto);   // ตรวจสอบ form-data ที่ส่งมา
    console.log('file:', file);        // ตรวจสอบไฟล์ที่อัปโหลด
    return this.postService.create(createDto, req.user.userId, file);
  }
  

  @Get()
  findAll() {
    return this.postService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.postService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: (_, file, cb) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, uniqueSuffix + extname(file.originalname));
        },
      }),
    }),
  )
  update(
    @Param('id') id: string,
    @Body() updateDto: UpdatePostandupDto,
    @Request() req,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.postService.update(id, updateDto, req.user.userId, file);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string, @Request() req) {
    return this.postService.remove(id, req.user.userId);
  }
}


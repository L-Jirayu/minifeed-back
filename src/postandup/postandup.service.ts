import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as fs from 'fs';
import * as path from 'path';

import { Postandup } from './schemas/postandup.schema';
import { CreatePostandupDto } from './dto/create-postandup.dto';
import { UpdatePostandupDto } from './dto/update-postandup.dto';

@Injectable()
export class PostandupService {
  constructor(
    @InjectModel(Postandup.name) private readonly postModel: Model<Postandup>,
  ) {}

  async create(createPostandupDto: CreatePostandupDto, userId: string, file?: Express.Multer.File) {
    if (!userId) throw new UnauthorizedException();

    const newPost = new this.postModel({
      ...createPostandupDto,
      userId,
      imageUrl: file ? file.filename : null,
    });
    return newPost.save();
  }

  async findAll() {
    return this.postModel.find().sort({ createdAt: -1 }).exec();
  }

  async findOne(id: string) {
    const post = await this.postModel.findById(id).exec();
    if (!post) throw new NotFoundException(`Post with ID ${id} not found`);
    return post;
  }

  async update(id: string, updateDto: UpdatePostandupDto, userId: string, file?: Express.Multer.File) {
    const post = await this.postModel.findById(id).exec();
    if (!post) throw new NotFoundException(`Post with ID ${id} not found`);
    if (post.userId !== userId) throw new UnauthorizedException();

    if (file) {
      if (post.imageUrl) {
        const oldPath = path.join(process.cwd(), 'uploads', post.imageUrl);
        if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
      }
      post.imageUrl = file.filename;  // ← เซ็ตเสมอเมื่อมีไฟล์ใหม่
    }

    Object.assign(post, updateDto);
    return post.save();
  }

  async remove(id: string, userId: string) {
    const post = await this.postModel.findById(id).exec();
    if (!post) throw new NotFoundException(`Post with ID ${id} not found`);
    if (post.userId !== userId) throw new UnauthorizedException();

    if (post.imageUrl) {
      const filePath = path.join(process.cwd(), 'uploads', post.imageUrl);
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    }

    return this.postModel.findByIdAndDelete(id).exec();
  }
}

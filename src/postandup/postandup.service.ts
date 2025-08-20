import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Postandup } from './schemas/postandup.schema';
import { Model } from 'mongoose';
import { CreatePostandupDto } from './dto/create-postandup.dto';
import { UpdatePostandupDto } from './dto/update-postandup.dto';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class PostandupService {
  constructor(
    @InjectModel(Postandup.name) private readonly postModel: Model<Postandup>,
  ) {}

  async create(createPostandupDto: CreatePostandupDto, file?: Express.Multer.File) {
    const newPost = new this.postModel({
      ...createPostandupDto,
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

  async update(id: string, updatePostandupDto: UpdatePostandupDto, file?: Express.Multer.File) {
    const post = await this.postModel.findById(id).exec();
    if (!post) throw new NotFoundException(`Post with ID ${id} not found`);

    if (file) {
      if (post.imageUrl) {
        const oldPath = path.join(process.cwd(), 'uploads', post.imageUrl);
        if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
      }
      post.imageUrl = file.filename;
    }

    Object.assign(post, updatePostandupDto);
    return post.save();
  }

  async remove(id: string) {
    const post = await this.postModel.findByIdAndDelete(id).exec();
    if (!post) throw new NotFoundException(`Post with ID ${id} not found`);
    if (post.imageUrl) {
      const filePath = path.join(process.cwd(), 'uploads', post.imageUrl);
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    }
    return post;
  }
}

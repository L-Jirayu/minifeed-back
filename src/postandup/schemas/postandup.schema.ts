import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Postandup extends Document {
  @Prop({ required: true })
  content: string;

  @Prop()
  imageUrl?: string;

  @Prop({ required: true })
  userId: string; // อ้างถึงผู้ใช้ที่สร้างโพสต์
}

export const PostandupSchema = SchemaFactory.createForClass(Postandup);

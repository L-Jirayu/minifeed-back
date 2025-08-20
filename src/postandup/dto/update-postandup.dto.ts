import { PartialType } from '@nestjs/mapped-types';
import { CreatePostandupDto } from './create-postandup.dto';

export class UpdatePostandupDto extends PartialType(CreatePostandupDto) {}

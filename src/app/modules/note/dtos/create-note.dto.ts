import { IsNotEmpty, IsInt, IsString , IsOptional, IsArray} from 'class-validator';
import { NoteTypeEnum } from '../Enums/note-type';



export class CreateNoteDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  type: NoteTypeEnum;

  @IsNotEmpty()
  @IsInt()
  folderId: number;

  @IsOptional()
  @IsString()
  textNote?: string;

  @IsOptional()
  @IsArray()
  listNote?: string[];
}
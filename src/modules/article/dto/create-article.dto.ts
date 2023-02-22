import { IsArray, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
class CreateArticleDto {
  @ApiProperty({
    description: `title`,
    example: 'Design',
  })
  @IsNotEmpty()
  @IsString()
  readonly title: string;

  @ApiProperty({
    description: `Description`,
    example: 'Design is ..., because ......, but .... ',
  })
  @IsNotEmpty()
  @IsString()
  readonly description: string;

  @ApiProperty({
    description: `Tags`,
    example: ['#ux', '#ui', '#design'],
  })
  @IsNotEmpty()
  @IsArray()
  readonly tags: string[];

  @ApiProperty({
    description: `Article image`,
    example: 'file',
    type: 'string',
    format: 'binary',
  })
  @IsNotEmpty()
  @IsString()
  readonly file: Express.Multer.File;
}

export default CreateArticleDto;
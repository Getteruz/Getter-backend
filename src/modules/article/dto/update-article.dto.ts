import { IsArray, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
class UpdateArticleDto {
  @ApiProperty({
    description: `title`,
    example: 'Design',
  })
  @IsOptional()
  @IsString()
  readonly title: string;

  @ApiProperty({
    description: `Description`,
    example: 'Design is ..., because ......, but .... ',
  })
  @IsOptional()
  @IsString()
  readonly description: string;

  @ApiProperty({
    description: `Tags`,
    example: ['#ux', '#ui', '#design'],
  })
  @IsOptional()
  @IsArray()
  readonly tags: string[];

  @ApiProperty({
    description: `Article image`,
    example: 'file',
    type: 'string',
    format: 'binary',
  })
  @IsOptional()
  @IsString()
  readonly file: Express.Multer.File;
}

export default UpdateArticleDto;

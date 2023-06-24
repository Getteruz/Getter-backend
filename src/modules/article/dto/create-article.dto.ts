import { IsArray, IsNotEmpty, IsString, isArray } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { BadRequestException } from '@nestjs/common';

function parseTextToArray(name: string, value?: string) {
  const arr = value ? JSON.parse(value) : '';
  if (!isArray(arr)) {
    throw new BadRequestException(`${name} should be array.`);
  }
  return arr;
}

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
  @Transform(({ value }: { value: string }) => parseTextToArray('tags', value))
  readonly tags: string[];

  @ApiProperty({
    description: `Article image`,
    example: 'file',
    type: 'string',
    format: 'binary',
  })
  avatar:string

  @ApiProperty({
    description: `Category ID`,
    example: '734912fd-e011-4da6-b0a3-031fd82ab2f9',
  })
  @IsNotEmpty()
  @IsString()
  readonly category: string;

  @ApiProperty({
    description: `User ID`,
    example: '734912fd-e011-4da6-b0a3-031fd82ab2f9',
  })
  @IsNotEmpty()
  @IsString()
  readonly user: string;
}

export default CreateArticleDto;

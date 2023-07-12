import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { CategoryEnum } from '../../../infra/shared/enum';

class CreateCategoryDto {
  @ApiProperty({
    description: 'Title',
    example: 'Backend developer',
  })
  @IsNotEmpty()
  @IsString()
  readonly title: string;

  @ApiProperty({
    description: 'Type',
    example: 'article',
  })
  @IsNotEmpty()
  @IsString()
  readonly type: CategoryEnum;
}

export default CreateCategoryDto;

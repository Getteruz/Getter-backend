import { IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { CategoryEnum } from '../../../infra/shared/enum';

class UpdateCategoryDto {
  @ApiProperty({
    description: 'Title',
    example: 'Backend developer',
  })
  @IsOptional()
  @IsString()
  readonly title: string;

  @ApiProperty({
    description: 'Type',
    example: 'article',
  })
  @IsOptional()
  @IsString()
  readonly type: CategoryEnum;
}

export default UpdateCategoryDto;

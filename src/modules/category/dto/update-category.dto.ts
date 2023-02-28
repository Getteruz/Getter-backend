import { IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

class UpdateCategoryDto {
  @ApiProperty({
    description: 'Title',
    example: 'Backend developer',
  })
  @IsOptional()
  @IsString()
  readonly title: string;
}

export default UpdateCategoryDto;

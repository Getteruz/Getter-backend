import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

class CreateCategory {
  @ApiProperty({
    description: 'Title',
    example: 'Backend developer',
  })
  @IsNotEmpty()
  @IsString()
  readonly title: string;
}

export default CreateCategory;

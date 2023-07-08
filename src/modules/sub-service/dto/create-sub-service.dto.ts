import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

class CreateSubServiceDto {
  @ApiProperty({
    description: 'Title',
    example: 'Backend developer',
  })
  @IsNotEmpty()
  @IsString()
  readonly title: string;

  @ApiProperty({
    description: 'Description',
    example: 'desc...',
  })
  @IsNotEmpty()
  @IsString()
  readonly description: string;

  @ApiProperty({
    description: 'our service',
    example: 'uuid',
  })
  @IsNotEmpty()
  @IsString()
  readonly ourService: string;
}

export default CreateSubServiceDto;

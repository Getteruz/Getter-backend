import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

class CreateOurServiceDto {
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
}

export default CreateOurServiceDto;

import { IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

class UpdateSubServiceDto {
  @ApiProperty({
    description: 'Title',
    example: 'Backend developer',
  })
  @IsOptional()
  @IsString()
  readonly title: string;

  @ApiProperty({
    description: 'Description',
    example: 'desc...',
  })
  @IsOptional()
  @IsString()
  readonly description: string;
}

export default UpdateSubServiceDto;

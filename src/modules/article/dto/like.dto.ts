import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

class LikeDto {
  @ApiProperty({
    description: `Article ID`,
    example: '734912fd-e011-4da6-b0a3-031fd82ab2f9',
  })
  @IsNotEmpty()
  @IsString()
  readonly articleId: string;

  @ApiProperty({
    description: `User ID`,
    example: '734912fd-e011-4da6-b0a3-031fd82ab2f9',
  })
  @IsNotEmpty()
  @IsString()
  readonly userId: string;
}

export default LikeDto;

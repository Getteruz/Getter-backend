import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

class CreateRepliedCommentDto {
  @ApiProperty({
    description: 'Title',
    example: 'Bad article 👎',
  })
  @IsNotEmpty()
  @IsString()
  readonly text: string;

  @ApiProperty({
    description: 'Comment id',
    example: '734912fd-e011-4da6-b0a3-031fd82ab2f9',
  })
  @IsNotEmpty()
  @IsString()
  readonly comment: string;

  @ApiProperty({
    description: 'User id',
    example: '734912fd-e011-4da6-b0a3-031fd82ab2f9',
  })
  @IsNotEmpty()
  @IsString()
  readonly user: string;
}

export default CreateRepliedCommentDto;

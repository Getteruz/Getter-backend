import { IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

class UpdateRepliedCommentDto {
  @ApiProperty({
    description: 'Text',
    example: 'good article 👍',
  })
  @IsOptional()
  @IsString()
  readonly text: string;
}

export default UpdateRepliedCommentDto;

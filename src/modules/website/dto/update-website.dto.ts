import { IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
class UpdateWebsiteDto {
  @ApiProperty({
    description: `title`,
    example: 'Getter',
  })
  @IsOptional()
  @IsString()
  readonly title: string;

  @ApiProperty({
    description: `Creator`,
    example: 'Getter.uz',
  })
  @IsOptional()
  @IsString()
  readonly creator: string;

  @ApiProperty({
    description: `Link of website`,
    example: 'https://getter.uz',
  })
  @IsOptional()
  @IsString()
  readonly link: string;
}

export default UpdateWebsiteDto;

import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
class CreateWebsiteDto {
  @ApiProperty({
    description: `title`,
    example: 'Getter',
  })
  @IsNotEmpty()
  @IsString()
  readonly title: string;

  @ApiProperty({
    description: `Creator`,
    example: 'Getter.uz',
  })
  @IsNotEmpty()
  @IsString()
  readonly creator: string;

  @ApiProperty({
    description: `Link of website`,
    example: 'https://getter.uz',
  })
  @IsNotEmpty()
  @IsString()
  readonly link: string;
}

export default CreateWebsiteDto;

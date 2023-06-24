import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

class CreatePortfolioDto {
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
    description: `Link of portfolio`,
    example: 'https://getter.uz',
  })
  @IsNotEmpty()
  @IsString()
  readonly link: string;

  @ApiProperty({
    description: `Portfolio image`,
    example: 'file',
    type: 'string',
    format: 'binary',
  })
  avatar;
}

export default CreatePortfolioDto;

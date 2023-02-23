import { IsString, MaxLength, IsEmail, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

class UpdateUserDto {
  @ApiProperty({
    description: `Name`,
    example: 'John Doe',
  })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  readonly name: string;

  @ApiProperty({
    description: `Email`,
    example: 'johndoe@gmail.com',
  })
  @IsOptional()
  @IsEmail()
  @MaxLength(125)
  readonly email: string;

  @ApiProperty({
    description: `Phone number`,
    example: '+998998887766',
  })
  @IsOptional()
  @IsString()
  readonly phone: string;

  @ApiProperty({
    description: `Article image`,
    example: 'file',
    type: 'string',
    format: 'binary',
  })
  @IsOptional()
  @IsString()
  readonly file: Express.Multer.File;
}

export default UpdateUserDto;

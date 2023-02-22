import { IsNotEmpty, IsString, MaxLength, IsEmail } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

class CreateUserDto {
  @ApiProperty({
    description: `Password`,
    example: 'dsk_45llsd',
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(64)
  readonly password: string;

  @ApiProperty({
    description: `Name`,
    example: 'John Doe',
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(50)
  readonly name: string;

  @ApiProperty({
    description: `Email`,
    example: 'johndoe@gmail.com',
  })
  @IsNotEmpty()
  @IsEmail()
  @MaxLength(125)
  readonly email: string;

  @ApiProperty({
    description: `Phone number`,
    example: '+998998887766',
  })
  @IsNotEmpty()
  @IsString()
  readonly phone: string;
}

export default CreateUserDto;

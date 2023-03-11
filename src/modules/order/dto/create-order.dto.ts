import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

class CreateOrderDto {
  @ApiProperty({
    description: `name`,
    example: 'John Doe',
  })
  @IsNotEmpty()
  @IsString()
  readonly name: string;

  @ApiProperty({
    description: `Company name`,
    example: 'BSS',
  })
  @IsNotEmpty()
  @IsString()
  readonly company: string;

  @ApiProperty({
    description: `Phone number`,
    example: '998887766',
  })
  @IsNotEmpty()
  @IsString()
  readonly phone: string;

  @ApiProperty({
    description: `Order file`,
    example: 'file',
    type: 'string',
    format: 'binary',
  })
  readonly file: Express.Multer.File;
}

export default CreateOrderDto;

import { IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

class UpdateOrderDto {
  @ApiProperty({
    description: `name`,
    example: 'John Doe',
  })
  @IsOptional()
  @IsString()
  readonly name: string;

  @ApiProperty({
    description: `Company name`,
    example: 'BSS',
  })
  @IsOptional()
  @IsString()
  readonly company: string;

  @ApiProperty({
    description: `Phone number`,
    example: '998887766',
  })
  @IsOptional()
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

export default UpdateOrderDto;

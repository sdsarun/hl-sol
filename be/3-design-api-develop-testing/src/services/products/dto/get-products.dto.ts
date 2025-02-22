import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsOptional, isString, IsString } from 'class-validator';
import { PaginationDTO } from 'src/shared/dto/pagination.dto';

export class GetProductsDTO extends PaginationDTO {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty({ required: false })
  @Transform(({ value }) => (isString(value) ? value.toLowerCase() : 'th'))
  @IsString()
  @IsOptional()
  language?: string;
}

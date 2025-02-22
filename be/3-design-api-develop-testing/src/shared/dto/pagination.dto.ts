import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { isNumber, IsNumber, IsOptional, Max, Min } from "class-validator";

export class PaginationDTO {
  @ApiProperty({ required: false })
  @Transform(({ value }) => (isNumber(value) ? value : 0))
  @IsNumber()
  @IsOptional()
  @Min(0)
  offset?: number;

  @ApiProperty({ required: false })
  @Transform(({ value }) => (isNumber(value) ? value : 10))
  @IsNumber()
  @IsOptional()
  @Max(100)
  @Min(0)
  limit?: number;
}
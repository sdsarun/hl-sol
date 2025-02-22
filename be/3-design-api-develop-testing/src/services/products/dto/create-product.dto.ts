import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsNotEmpty, isString, IsString, MaxLength } from "class-validator";

export class CreateProductDTO {
  @ApiProperty({ example: "Smartphone", description: "The name of the product" })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: "A high-quality smartphone with advanced features", description: "Detailed description of the product" })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ example: "EN", description: "Language code base on ISO 639-1 (max length: 2 characters)" })
  @Transform(({ value }) => isString(value) ? value.toLowerCase(): undefined)
  @IsString()
  @MaxLength(2)
  @IsNotEmpty()
  language: string;
}
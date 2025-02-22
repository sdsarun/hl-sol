import { IsEnum, IsNumber, IsString, Max, Min } from 'class-validator';
import { IsTrueOrFalseString } from 'src/common/validators/is-true-or-false-string.validator';

export enum Environment {
  Development = 'development',
  Production = 'production',
  Test = 'test',
}

export class EnvironmentVariables {
  @IsEnum(Environment)
  NODE_ENV: Environment;

  @IsNumber()
  @Min(0)
  @Max(65535)
  PORT: number;

  @IsString()
  DB_HOST: string;

  @IsNumber()
  DB_PORT: number;

  @IsString()
  DB_USERNAME: string;

  @IsString()
  DB_PASSWORD: string;

  @IsString()
  DB_DATABASE: string;

  @IsString()
  DB_SCHEMA: string;

  @IsTrueOrFalseString()
  DB_SSL: string;
}

import { IsInt, Min, Max, IsString, IsOptional } from 'class-validator';

export class CreateRatingDto {
  @IsInt()
  @Min(1)
  @Max(5)
  value: number;

  @IsString()
  @IsOptional()
  comment?: string;
}

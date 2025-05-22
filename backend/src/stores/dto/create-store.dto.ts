import { IsString, IsEmail, IsNotEmpty, MaxLength } from 'class-validator';

export class CreateStoreDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(400, { message: 'Address must not exceed 400 characters' })
  address: string;

  @IsString()
  @IsNotEmpty()
  ownerId: string;
}

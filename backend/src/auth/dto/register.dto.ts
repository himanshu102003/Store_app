import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsString,
  Length,
  Matches,
} from 'class-validator';
import { UserRole } from '../../users/entities/user.entity';

export class RegisterDto {
  @IsString()
  @IsNotEmpty()
  @Length(20, 60, { message: 'Name must be between 20 and 60 characters' })
  name: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @Length(8, 16)
  @Matches(/(?=.*[A-Z])(?=.*[!@#$%^&*])/, {
    message:
      'Password must contain at least one uppercase letter and one special character',
  })
  password: string;

  @IsString()
  @IsNotEmpty()
  @Length(1, 400, { message: 'Address must not exceed 400 characters' })
  address: string;

  @IsEnum(UserRole, { message: 'Invalid user role' })
  role: UserRole;
}

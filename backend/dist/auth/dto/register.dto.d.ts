import { UserRole } from '../../users/entities/user.entity';
export declare class RegisterDto {
    name: string;
    email: string;
    password: string;
    address: string;
    role: UserRole;
}

import { UsersService } from './users.service';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { UserRole } from './entities/user.entity';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    findAll(role?: UserRole): Promise<import("./entities/user.entity").User[]>;
    getUsersCount(): Promise<number>;
    findOne(id: string): Promise<import("./entities/user.entity").User>;
    updatePassword(id: string, updatePasswordDto: UpdatePasswordDto): Promise<{
        message: string;
    }>;
    remove(id: string): Promise<{
        message: string;
    }>;
}

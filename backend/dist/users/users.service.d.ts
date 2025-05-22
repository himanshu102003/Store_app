import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { UserRole } from './entities/user.entity';
export declare class UsersService {
    private usersRepository;
    constructor(usersRepository: Repository<User>);
    findAll(role?: UserRole): Promise<User[]>;
    findOne(id: string): Promise<User>;
    findByEmail(email: string): Promise<User | undefined>;
    updatePassword(id: string, updatePasswordDto: UpdatePasswordDto): Promise<void>;
    remove(id: string): Promise<void>;
    getUsersCount(): Promise<number>;
}

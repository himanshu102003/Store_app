import { Repository } from 'typeorm';
import { Store } from './entities/store.entity';
import { User } from '../users/entities/user.entity';
import { CreateStoreDto } from './dto/create-store.dto';
import { UpdateStoreDto } from './dto/update-store.dto';
export declare class StoresService {
    private storesRepository;
    private usersRepository;
    constructor(storesRepository: Repository<Store>, usersRepository: Repository<User>);
    create(createStoreDto: CreateStoreDto): Promise<Store>;
    findAll(search?: string, ownerId?: string): Promise<{
        data: Store[];
        count: number;
    }>;
    findOne(id: string): Promise<Store>;
    update(id: string, updateStoreDto: UpdateStoreDto): Promise<Store>;
    remove(id: string): Promise<void>;
    getStoresCount(): Promise<number>;
}

import { Repository } from 'typeorm';
import { Rating } from './entities/rating.entity';
import { Store } from '../stores/entities/store.entity';
import { User } from '../users/entities/user.entity';
import { CreateRatingDto } from './dto/create-rating.dto';
import { UpdateRatingDto } from './dto/update-rating.dto';
export declare class RatingsService {
    private ratingsRepository;
    private storesRepository;
    private usersRepository;
    constructor(ratingsRepository: Repository<Rating>, storesRepository: Repository<Store>, usersRepository: Repository<User>);
    create(userId: string, storeId: string, createRatingDto: CreateRatingDto): Promise<Rating>;
    findAll(storeId?: string, userId?: string): Promise<Rating[]>;
    findOne(id: string): Promise<Rating>;
    update(id: string, userId: string, updateRatingDto: UpdateRatingDto): Promise<Rating>;
    remove(id: string, userId: string, userRole: string): Promise<void>;
    getAverageRating(storeId: string): Promise<number>;
    getRatingsCount(storeId?: string): Promise<number>;
}

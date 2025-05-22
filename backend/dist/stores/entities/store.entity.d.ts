import { User } from '../../users/entities/user.entity';
import { Rating } from '../../ratings/entities/rating.entity';
import { BaseEntity } from '../../common/base.entity';
export declare class Store extends BaseEntity {
    name: string;
    email: string;
    address: string;
    owner: User;
    ratings: Rating[];
    averageRating?: number;
}

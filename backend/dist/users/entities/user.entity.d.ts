import { Rating } from '../../ratings/entities/rating.entity';
import { Store } from '../../stores/entities/store.entity';
import { BaseEntity } from '../../common/base.entity';
export declare enum UserRole {
    ADMIN = "admin",
    STORE_OWNER = "store_owner",
    USER = "user"
}
export declare class User extends BaseEntity {
    name: string;
    email: string;
    address: string;
    password: string;
    role: UserRole;
    ratings: Rating[];
    store: Store;
}

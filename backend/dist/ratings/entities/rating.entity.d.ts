import { User } from '../../users/entities/user.entity';
import { Store } from '../../stores/entities/store.entity';
import { BaseEntity } from '../../common/base.entity';
export declare class Rating extends BaseEntity {
    value: number;
    comment: string;
    user: User;
    userId: string;
    store: Store;
    storeId: string;
}

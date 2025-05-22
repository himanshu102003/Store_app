import { RatingsService } from './ratings.service';
import { CreateRatingDto } from './dto/create-rating.dto';
import { UpdateRatingDto } from './dto/update-rating.dto';
export declare class RatingsController {
    private readonly ratingsService;
    constructor(ratingsService: RatingsService);
    create(storeId: string, createRatingDto: CreateRatingDto, req: any): Promise<import("./entities/rating.entity").Rating>;
    findAll(storeId?: string, userId?: string): Promise<import("./entities/rating.entity").Rating[]>;
    findMyRatings(req: any): Promise<import("./entities/rating.entity").Rating[]>;
    getAverageRating(storeId: string): Promise<number>;
    getCount(storeId?: string): Promise<number>;
    findOne(id: string): Promise<import("./entities/rating.entity").Rating>;
    update(id: string, updateRatingDto: UpdateRatingDto, req: any): Promise<import("./entities/rating.entity").Rating>;
    remove(id: string, req: any): Promise<void>;
}

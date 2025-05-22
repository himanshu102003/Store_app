"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RatingsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const rating_entity_1 = require("./entities/rating.entity");
const store_entity_1 = require("../stores/entities/store.entity");
const user_entity_1 = require("../users/entities/user.entity");
let RatingsService = class RatingsService {
    constructor(ratingsRepository, storesRepository, usersRepository) {
        this.ratingsRepository = ratingsRepository;
        this.storesRepository = storesRepository;
        this.usersRepository = usersRepository;
    }
    async create(userId, storeId, createRatingDto) {
        const { value, comment } = createRatingDto;
        const user = await this.usersRepository.findOne({ where: { id: userId } });
        if (!user) {
            throw new common_1.NotFoundException(`User with ID ${userId} not found`);
        }
        const store = await this.storesRepository.findOne({
            where: { id: storeId },
        });
        if (!store) {
            throw new common_1.NotFoundException(`Store with ID ${storeId} not found`);
        }
        const existingRating = await this.ratingsRepository.findOne({
            where: { user: { id: userId }, store: { id: storeId } },
        });
        if (existingRating) {
            throw new common_1.BadRequestException('You have already rated this store');
        }
        const rating = this.ratingsRepository.create({
            value,
            comment,
            user,
            store,
        });
        return this.ratingsRepository.save(rating);
    }
    async findAll(storeId, userId) {
        const query = this.ratingsRepository
            .createQueryBuilder('rating')
            .leftJoinAndSelect('rating.user', 'user')
            .leftJoinAndSelect('rating.store', 'store');
        if (storeId) {
            query.andWhere('store.id = :storeId', { storeId });
        }
        if (userId) {
            query.andWhere('user.id = :userId', { userId });
        }
        return query.getMany();
    }
    async findOne(id) {
        const rating = await this.ratingsRepository.findOne({
            where: { id },
            relations: ['user', 'store'],
        });
        if (!rating) {
            throw new common_1.NotFoundException(`Rating with ID ${id} not found`);
        }
        return rating;
    }
    async update(id, userId, updateRatingDto) {
        const rating = await this.findOne(id);
        if (rating.user.id !== userId) {
            throw new common_1.BadRequestException('You can only update your own ratings');
        }
        const updatedRating = { ...rating, ...updateRatingDto };
        return this.ratingsRepository.save(updatedRating);
    }
    async remove(id, userId, userRole) {
        const rating = await this.findOne(id);
        if (userRole !== 'admin' && rating.user.id !== userId) {
            throw new common_1.BadRequestException('You can only delete your own ratings');
        }
        await this.ratingsRepository.remove(rating);
    }
    async getAverageRating(storeId) {
        const result = await this.ratingsRepository
            .createQueryBuilder('rating')
            .select('AVG(rating.value)', 'average')
            .where('rating.storeId = :storeId', { storeId })
            .getRawOne();
        return parseFloat(result.average) || 0;
    }
    async getRatingsCount(storeId) {
        const query = this.ratingsRepository.createQueryBuilder('rating');
        if (storeId) {
            query.where('rating.storeId = :storeId', { storeId });
        }
        return query.getCount();
    }
};
exports.RatingsService = RatingsService;
exports.RatingsService = RatingsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(rating_entity_1.Rating)),
    __param(1, (0, typeorm_1.InjectRepository)(store_entity_1.Store)),
    __param(2, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], RatingsService);
//# sourceMappingURL=ratings.service.js.map
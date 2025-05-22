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
exports.StoresService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const store_entity_1 = require("./entities/store.entity");
const user_entity_1 = require("../users/entities/user.entity");
const user_entity_2 = require("../users/entities/user.entity");
let StoresService = class StoresService {
    constructor(storesRepository, usersRepository) {
        this.storesRepository = storesRepository;
        this.usersRepository = usersRepository;
    }
    async create(createStoreDto) {
        const { ownerId, ...storeData } = createStoreDto;
        const owner = await this.usersRepository.findOne({
            where: { id: ownerId, role: user_entity_2.UserRole.STORE_OWNER },
        });
        if (!owner) {
            throw new common_1.BadRequestException('Invalid store owner ID or user is not a store owner');
        }
        const existingStore = await this.storesRepository.findOne({
            where: { owner: { id: ownerId } },
        });
        if (existingStore) {
            throw new common_1.BadRequestException('This user already owns a store');
        }
        const store = this.storesRepository.create({
            ...storeData,
            owner,
        });
        return this.storesRepository.save(store);
    }
    async findAll(search, ownerId) {
        const query = this.storesRepository
            .createQueryBuilder('store')
            .leftJoinAndSelect('store.owner', 'owner')
            .leftJoinAndSelect('store.ratings', 'ratings')
            .loadRelationCountAndMap('store.ratingsCount', 'store.ratings')
            .addSelect('COALESCE(AVG(ratings.value), 0)', 'averageRating')
            .groupBy('store.id, owner.id');
        if (search) {
            query.andWhere('(LOWER(store.name) LIKE LOWER(:search) OR LOWER(store.address) LIKE LOWER(:search))', { search: `%${search}%` });
        }
        if (ownerId) {
            query.andWhere('owner.id = :ownerId', { ownerId });
        }
        const [data, count] = await Promise.all([
            query.getMany(),
            query.getCount(),
        ]);
        const storesWithAvgRating = await Promise.all(data.map(async (store) => {
            const avgResult = await this.storesRepository
                .createQueryBuilder('store')
                .select('AVG(ratings.value)', 'average')
                .leftJoin('store.ratings', 'ratings')
                .where('store.id = :storeId', { storeId: store.id })
                .getRawOne();
            return {
                ...store,
                averageRating: parseFloat(avgResult.average) || 0,
            };
        }));
        return { data: storesWithAvgRating, count };
    }
    async findOne(id) {
        const store = await this.storesRepository.findOne({
            where: { id },
            relations: ['owner', 'ratings', 'ratings.user'],
        });
        if (!store) {
            throw new common_1.NotFoundException(`Store with ID ${id} not found`);
        }
        const avgResult = await this.storesRepository
            .createQueryBuilder('store')
            .select('AVG(ratings.value)', 'average')
            .leftJoin('store.ratings', 'ratings')
            .where('store.id = :storeId', { storeId: id })
            .getRawOne();
        return {
            ...store,
            averageRating: parseFloat(avgResult.average) || 0,
        };
    }
    async update(id, updateStoreDto) {
        const store = await this.findOne(id);
        const updatedStore = { ...store, ...updateStoreDto };
        return this.storesRepository.save(updatedStore);
    }
    async remove(id) {
        const result = await this.storesRepository.delete(id);
        if (result.affected === 0) {
            throw new common_1.NotFoundException(`Store with ID ${id} not found`);
        }
    }
    async getStoresCount() {
        return this.storesRepository.count();
    }
};
exports.StoresService = StoresService;
exports.StoresService = StoresService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(store_entity_1.Store)),
    __param(1, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], StoresService);
//# sourceMappingURL=stores.service.js.map
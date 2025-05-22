import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Store } from './entities/store.entity';
import { User } from '../users/entities/user.entity';
import { CreateStoreDto } from './dto/create-store.dto';
import { UpdateStoreDto } from './dto/update-store.dto';
import { UserRole } from '../users/entities/user.entity';

@Injectable()
export class StoresService {
  constructor(
    @InjectRepository(Store)
    private storesRepository: Repository<Store>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(createStoreDto: CreateStoreDto): Promise<Store> {
    const { ownerId, ...storeData } = createStoreDto;

    // Check if owner exists and is a store owner
    const owner = await this.usersRepository.findOne({
      where: { id: ownerId, role: UserRole.STORE_OWNER },
    });

    if (!owner) {
      throw new BadRequestException(
        'Invalid store owner ID or user is not a store owner',
      );
    }

    // Check if owner already has a store
    const existingStore = await this.storesRepository.findOne({
      where: { owner: { id: ownerId } },
    });

    if (existingStore) {
      throw new BadRequestException('This user already owns a store');
    }

    const store = this.storesRepository.create({
      ...storeData,
      owner,
    });

    return this.storesRepository.save(store);
  }

  async findAll(
    search?: string,
    ownerId?: string,
  ): Promise<{ data: Store[]; count: number }> {
    const query = this.storesRepository
      .createQueryBuilder('store')
      .leftJoinAndSelect('store.owner', 'owner')
      .leftJoinAndSelect('store.ratings', 'ratings')
      .loadRelationCountAndMap('store.ratingsCount', 'store.ratings')
      .addSelect('COALESCE(AVG(ratings.value), 0)', 'averageRating')
      .groupBy('store.id, owner.id');

    if (search) {
      query.andWhere(
        '(LOWER(store.name) LIKE LOWER(:search) OR LOWER(store.address) LIKE LOWER(:search))',
        { search: `%${search}%` },
      );
    }

    if (ownerId) {
      query.andWhere('owner.id = :ownerId', { ownerId });
    }

    const [data, count] = await Promise.all([
      query.getMany(),
      query.getCount(),
    ]);

    // Calculate average rating for each store
    const storesWithAvgRating = await Promise.all(
      data.map(async (store) => {
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
      }),
    );

    return { data: storesWithAvgRating, count };
  }

  async findOne(id: string): Promise<Store> {
    const store = await this.storesRepository.findOne({
      where: { id },
      relations: ['owner', 'ratings', 'ratings.user'],
    });

    if (!store) {
      throw new NotFoundException(`Store with ID ${id} not found`);
    }

    // Calculate average rating
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

  async update(id: string, updateStoreDto: UpdateStoreDto): Promise<Store> {
    const store = await this.findOne(id);
    const updatedStore = { ...store, ...updateStoreDto };
    return this.storesRepository.save(updatedStore);
  }

  async remove(id: string): Promise<void> {
    const result = await this.storesRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Store with ID ${id} not found`);
    }
  }

  async getStoresCount(): Promise<number> {
    return this.storesRepository.count();
  }
}

import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Rating } from './entities/rating.entity';
import { Store } from '../stores/entities/store.entity';
import { User } from '../users/entities/user.entity';
import { CreateRatingDto } from './dto/create-rating.dto';
import { UpdateRatingDto } from './dto/update-rating.dto';

@Injectable()
export class RatingsService {
  constructor(
    @InjectRepository(Rating)
    private ratingsRepository: Repository<Rating>,
    @InjectRepository(Store)
    private storesRepository: Repository<Store>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(
    userId: string,
    storeId: string,
    createRatingDto: CreateRatingDto,
  ): Promise<Rating> {
    const { value, comment } = createRatingDto;

    // Check if user exists
    const user = await this.usersRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    // Check if store exists
    const store = await this.storesRepository.findOne({
      where: { id: storeId },
    });
    if (!store) {
      throw new NotFoundException(`Store with ID ${storeId} not found`);
    }

    // Check if user has already rated this store
    const existingRating = await this.ratingsRepository.findOne({
      where: { user: { id: userId }, store: { id: storeId } },
    });

    if (existingRating) {
      throw new BadRequestException('You have already rated this store');
    }

    const rating = this.ratingsRepository.create({
      value,
      comment,
      user,
      store,
    });

    return this.ratingsRepository.save(rating);
  }

  async findAll(storeId?: string, userId?: string): Promise<Rating[]> {
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

  async findOne(id: string): Promise<Rating> {
    const rating = await this.ratingsRepository.findOne({
      where: { id },
      relations: ['user', 'store'],
    });

    if (!rating) {
      throw new NotFoundException(`Rating with ID ${id} not found`);
    }

    return rating;
  }

  async update(
    id: string,
    userId: string,
    updateRatingDto: UpdateRatingDto,
  ): Promise<Rating> {
    const rating = await this.findOne(id);

    // Check if the user is the owner of the rating
    if (rating.user.id !== userId) {
      throw new BadRequestException('You can only update your own ratings');
    }

    const updatedRating = { ...rating, ...updateRatingDto };
    return this.ratingsRepository.save(updatedRating);
  }

  async remove(id: string, userId: string, userRole: string): Promise<void> {
    const rating = await this.findOne(id);

    // Only allow deletion if user is admin or the owner of the rating
    if (userRole !== 'admin' && rating.user.id !== userId) {
      throw new BadRequestException('You can only delete your own ratings');
    }

    await this.ratingsRepository.remove(rating);
  }

  async getAverageRating(storeId: string): Promise<number> {
    const result = await this.ratingsRepository
      .createQueryBuilder('rating')
      .select('AVG(rating.value)', 'average')
      .where('rating.storeId = :storeId', { storeId })
      .getRawOne();

    return parseFloat(result.average) || 0;
  }

  async getRatingsCount(storeId?: string): Promise<number> {
    const query = this.ratingsRepository.createQueryBuilder('rating');

    if (storeId) {
      query.where('rating.storeId = :storeId', { storeId });
    }

    return query.getCount();
  }
}

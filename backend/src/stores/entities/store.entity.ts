import { Entity, Column, OneToOne, OneToMany, JoinColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Rating } from '../../ratings/entities/rating.entity';
import { BaseEntity } from '../../common/base.entity';

@Entity('stores')
export class Store extends BaseEntity {
  @Column({ length: 100 })
  name: string;

  @Column({ unique: true })
  email: string;

  @Column({ length: 400 })
  address: string;

  @OneToOne(() => User, (user) => user.store)
  @JoinColumn()
  owner: User;

  @OneToMany(() => Rating, (rating) => rating.store)
  ratings: Rating[];

  // Virtual property for average rating
  averageRating?: number;
}

import { Entity, Column, OneToMany, OneToOne, JoinColumn } from 'typeorm';
import { Rating } from '../../ratings/entities/rating.entity';
import { Store } from '../../stores/entities/store.entity';
import { BaseEntity } from '../../common/base.entity';

export enum UserRole {
  ADMIN = 'admin',
  STORE_OWNER = 'store_owner',
  USER = 'user',
}

@Entity('users')
export class User extends BaseEntity {
  @Column({ length: 60 })
  name: string;

  @Column({ unique: true })
  email: string;

  @Column({ length: 400 })
  address: string;

  @Column()
  password: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.USER,
  })
  role: UserRole;

  @OneToMany(() => Rating, (rating) => rating.user)
  ratings: Rating[];

  @OneToOne(() => Store, (store) => store.owner)
  @JoinColumn()
  store: Store;
}

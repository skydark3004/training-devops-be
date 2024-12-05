import { Column, CreateDateColumn, Generated, PrimaryColumn, UpdateDateColumn } from 'typeorm';

export abstract class BaseEntity {
  @PrimaryColumn({ type: 'uuid' })
  @Generated('uuid')
  id: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ nullable: false, type: 'boolean', default: false })
  status: boolean;
}

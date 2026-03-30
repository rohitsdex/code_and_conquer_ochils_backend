import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { EventInstance } from './EventInstance';

@Entity('blocks')
export class Block {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'date' })
  start_date: string;

  @Column({ type: 'date' })
  end_date: string;

  @Column({ type: 'enum', enum: ['DRAFT', 'PUBLISHED'], default: 'DRAFT' })
  status: 'DRAFT' | 'PUBLISHED';

  @Column({ type: 'time', default: '14:00:00' })
  friday_training_start_time: string;

  // Relation: 1 Block -> Many Event Instances
  @OneToMany(() => EventInstance, (eventInstance) => eventInstance.block)
  events: EventInstance[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

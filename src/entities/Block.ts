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

  @Column({ type: 'varchar', default: 'DRAFT' })
  status: 'DRAFT' | 'PUBLISHED';

  @Column({ type: 'time', nullable: true })
  friday_training_start_time: string;

  @Column({ type: 'boolean', default: false })
  skip_friday_training: boolean;

  @Column({ type: 'boolean', default: false })
  no_assignments_required: boolean;

  // Relation: 1 Block -> Many Event Instances
  @OneToMany(() => EventInstance, (eventInstance) => eventInstance.block)
  events: EventInstance[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

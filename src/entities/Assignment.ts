import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { EventInstance } from './EventInstance';

export type AssignmentStatus = 'DRAFT' | 'INVITED' | 'ACCEPTED' | 'CONFIRMED' | 'REJECTED';

@Entity('assignments')
export class Assignment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  eventInstanceId: string;

  @ManyToOne(() => EventInstance, (eventInstance) => eventInstance.assignments, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'eventInstanceId' })
  eventInstance: EventInstance;

  @Column({ type: 'uuid' })
  staffId: string; // Foreign key to Staff table

  @Column({ type: 'enum', enum: ['DRAFT', 'INVITED', 'ACCEPTED', 'CONFIRMED', 'REJECTED'] })
  status: AssignmentStatus;

  @Column({ type: 'timestamp' })
  assignedAt: Date;
}

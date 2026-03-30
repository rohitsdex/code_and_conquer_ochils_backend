import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { Block } from './Block';
import { Assignment } from './Assignment';

@Entity('event_instances')
export class EventInstance {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  blockId: string;

  @ManyToOne(() => Block, (block) => block.events, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'blockId' })
  block: Block;

  @Column({ type: 'varchar' })
  eventTypeId: string; // Foreign key to a generic EventType dict

  @Column({ type: 'varchar', nullable: true })
  title: string;

  @Column({ type: 'date' })
  date: string;

  @Column({ type: 'time' })
  startTime: string;

  @Column({ type: 'time' })
  endTime: string;

  @Column({ type: 'varchar', nullable: true })
  locationId: string;

  @Column({ type: 'int' })
  requiredStaffCount: number;

  @Column({ type: 'varchar', default: 'GENERAL' })
  session_category: string;

  @OneToMany(() => Assignment, (assignment) => assignment.eventInstance)
  assignments: Assignment[];
}

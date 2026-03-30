import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('event_types')
export class EventType {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'int', default: 120 })
  durationMinutes: number;

  @Column({ type: 'int', default: 2 })
  defaultStaffCount: number;

  @Column({ type: 'simple-array', default: '' })
  qualifications: string[];

  @Column({ type: 'varchar', nullable: true })
  color: string;

  @Column({ type: 'varchar', default: 'GENERAL' })
  session_category: string;

  @CreateDateColumn()
  created_at: Date;
}

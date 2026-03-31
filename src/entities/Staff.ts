import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { Assignment } from './Assignment';

export type StaffType = 'FULLTIME' | 'HOURLY';
export type StaffDesignation = 'YOUTH_WORKER' | 'SESSION_SUPPORT' | 'MANAGEMENT' | 'VOLUNTEER';

@Entity('staff')
export class Staff {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  email: string;

  @Column({ type: 'varchar', nullable: true })
  employee_id: string;

  @Column({ type: 'varchar' })
  staff_type: StaffType;

  @Column({ type: 'varchar' })
  designation: StaffDesignation;

  @Column({ type: 'varchar', nullable: true })
  department: string;

  @Column({ type: 'numeric', precision: 5, scale: 2, default: 0 })
  weekly_hours_cap: number;

  @Column({ type: 'numeric', precision: 5, scale: 2, default: 0 })
  currentWeeklyHours: number;

  @Column({ type: 'numeric', precision: 7, scale: 2, default: 0 })
  hourly_rate: number;

  @Column({ type: 'simple-array', default: '' })
  qualifications: string[];

  @Column({ type: 'simple-json', default: '[]' })
  availability: { dayOfWeek: number; startTime: string; endTime: string }[];

  @Column({ type: 'simple-json', default: '[]' })
  leave_periods: { start: string; end: string }[];

  @OneToMany(() => Assignment, (assignment) => assignment.staffId)
  assignments: Assignment[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

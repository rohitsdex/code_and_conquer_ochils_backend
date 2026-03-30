import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { Assignment } from './Assignment';

export type StaffType = 'FULLTIME' | 'SESSIONAL' | 'HOURLY';
export type StaffDesignation = 'YOUTH_WORKER' | 'SESSION_SUPPORT' | 'MANAGEMENT' | 'VOLUNTEER';

@Entity('staff')
export class Staff {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  email: string;

  @Column({ type: 'varchar' })
  staff_type: StaffType;

  @Column({ type: 'varchar' })
  designation: StaffDesignation;

  @Column({ type: 'numeric', precision: 5, scale: 2, default: 0 })
  weekly_hours_cap: number;

  @Column({ type: 'simple-array', default: '' })
  qualifications: string[];

  @OneToMany(() => Assignment, (assignment) => assignment.staffId) // Not a direct relation right now on Assignment to Staff entity, but could be mapped
  assignments: Assignment[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

export type NotificationType = 'INVITE' | 'ASSIGNMENT_UPDATE' | 'ROLE_CHANGE' | 'SYSTEM' | 'ERROR';

@Entity('notifications')
export class Notification {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  userId: string;

  @Column({ type: 'varchar' })
  title: string;

  @Column({ type: 'text' })
  message: string;

  @Column({ type: 'enum', enum: ['INVITE', 'ASSIGNMENT_UPDATE', 'ROLE_CHANGE', 'SYSTEM', 'ERROR'] })
  type: NotificationType;

  @Column({ type: 'boolean', default: false })
  read: boolean;

  @Column({ type: 'varchar', nullable: true })
  link: string;

  @CreateDateColumn()
  created_at: Date;
}

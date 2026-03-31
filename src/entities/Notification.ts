import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

export type NotificationType = 'INVITE' | 'ASSIGNMENT' | 'INVITE_RESPONSE' | 'EVENT_UPDATE' | 'EMAIL_SENT' | 'ROLE_CHANGE' | 'SYSTEM' | 'ERROR' | 'ASSIGNMENT_UPDATE';

@Entity('notifications')
export class Notification {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar' })
  type: NotificationType;

  @Column({ type: 'varchar' })
  title: string;

  @Column({ type: 'text' })
  message: string;

  @Column({ type: 'boolean', default: false })
  read: boolean;

  @Column({ type: 'varchar', nullable: true })
  linkTo: string;

  @Column({ type: 'boolean', default: false, nullable: true })
  emailSent: boolean;

  @Column({ type: 'varchar', default: 'ALL' })
  recipientRole: 'ADMIN' | 'STAFF' | 'ALL';

  @CreateDateColumn()
  createdAt: Date;
}

import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

import { User } from '@/users/entities';

export enum Trigger {
  MalwareDetected = 'MALWARE_DETECTED',
  LoginAttempt = 'LOGIN_ATTEMPT',
  PhishingAlert = 'PHISHING_ALERT',
}

export enum Action {
  IsolateHost = 'ISOLATE_HOST',
  NotifyAdmin = 'NOTIFY_ADMIN',
  BlockIp = 'BLOCK_IP',
}

@Entity('playbooks')
export class Playbook {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({
    type: 'enum',
    enum: Trigger,
  })
  trigger: Trigger;

  @Column('simple-array')
  actions: Action[];

  @Column('uuid')
  userId: string;

  @ManyToOne(() => User, (user) => user.playbooks, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

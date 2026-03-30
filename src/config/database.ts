import { DataSource } from 'typeorm';
import { Block } from '../entities/Block';
import { EventInstance } from '../entities/EventInstance';
import { Assignment } from '../entities/Assignment';
import { Staff } from '../entities/Staff';
import { Location } from '../entities/Location';
import { EventType } from '../entities/EventType';
import { Notification } from '../entities/Notification';

export const AppDataSource = new DataSource({
  type: 'sqlite',
  database: 'staffflow.sqlite',
  synchronize: process.env.NODE_ENV !== 'production', // Auto-create tables in DEV
  logging: false,
  entities: [Block, EventInstance, Assignment, Staff, Location, EventType, Notification],
});

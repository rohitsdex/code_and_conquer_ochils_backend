import { Request, Response } from 'express';
import { AppDataSource } from '../config/database';
import { Location } from '../entities/Location';
import { EventType } from '../entities/EventType';
import { Staff } from '../entities/Staff';
import { Notification } from '../entities/Notification';

export class MiscController {
  // --- LOCATIONS ---
  static async getLocations(req: Request, res: Response) {
    const repo = AppDataSource.getRepository(Location);
    res.json(await repo.find());
  }

  // --- EVENT TYPES ---
  static async getEventTypes(req: Request, res: Response) {
    const repo = AppDataSource.getRepository(EventType);
    res.json(await repo.find());
  }

  // --- STAFF ---
  static async getStaff(req: Request, res: Response) {
    const repo = AppDataSource.getRepository(Staff);
    res.json(await repo.find());
  }

  // --- NOTIFICATIONS ---
  static async getNotifications(req: Request, res: Response) {
    const repo = AppDataSource.getRepository(Notification);
    res.json(await repo.find({ order: { created_at: 'DESC' } }));
  }
}

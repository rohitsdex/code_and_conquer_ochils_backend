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

  static async createLocation(req: Request, res: Response) {
    const repo = AppDataSource.getRepository(Location);
    const location = repo.create(req.body);
    res.status(201).json(await repo.save(location));
  }

  static async deleteLocation(req: Request, res: Response) {
    const repo = AppDataSource.getRepository(Location);
    await repo.delete(req.params.id as string);
    res.status(204).send();
  }

  // --- EVENT TYPES ---
  static async getEventTypes(req: Request, res: Response) {
    const repo = AppDataSource.getRepository(EventType);
    res.json(await repo.find());
  }

  static async createEventType(req: Request, res: Response) {
    const repo = AppDataSource.getRepository(EventType);
    const eventType = repo.create(req.body);
    res.status(201).json(await repo.save(eventType));
  }

  static async updateEventType(req: Request, res: Response) {
    const repo = AppDataSource.getRepository(EventType);
    await repo.update(req.params.id as string, req.body);
    res.json(await repo.findOneBy({ id: req.params.id as string }));
  }

  static async deleteEventType(req: Request, res: Response) {
    const repo = AppDataSource.getRepository(EventType);
    await repo.delete(req.params.id as string);
    res.status(204).send();
  }

  // --- STAFF ---
  static async getStaff(req: Request, res: Response) {
    const repo = AppDataSource.getRepository(Staff);
    res.json(await repo.find());
  }

  static async createStaff(req: Request, res: Response) {
    const repo = AppDataSource.getRepository(Staff);
    const staff = repo.create(req.body);
    res.status(201).json(await repo.save(staff));
  }

  static async updateStaff(req: Request, res: Response) {
    const repo = AppDataSource.getRepository(Staff);
    await repo.update(req.params.id as string, req.body);
    res.json(await repo.findOneBy({ id: req.params.id as string }));
  }

  static async deleteStaff(req: Request, res: Response) {
    const repo = AppDataSource.getRepository(Staff);
    await repo.delete(req.params.id as string);
    res.status(204).send();
  }

  // --- NOTIFICATIONS ---
  static async getNotifications(req: Request, res: Response) {
    const repo = AppDataSource.getRepository(Notification);
    res.json(await repo.find({ order: { created_at: 'DESC' } }));
  }

  static async markNotificationRead(req: Request, res: Response) {
    const repo = AppDataSource.getRepository(Notification);
    await repo.update(req.params.id as string, { read: true });
    res.status(204).send();
  }

  static async markAllNotificationsRead(req: Request, res: Response) {
    const repo = AppDataSource.getRepository(Notification);
    await repo.update({ read: false }, { read: true });
    res.status(204).send();
  }
}


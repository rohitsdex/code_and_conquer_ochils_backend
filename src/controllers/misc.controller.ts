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

  static async getLocationById(req: Request, res: Response) {
    const repo = AppDataSource.getRepository(Location);
    const loc = await repo.findOneBy({ id: req.params.id as string });
    if (!loc) return res.status(404).json({ error: 'Location not found' });
    res.json(loc);
  }

  static async createLocation(req: Request, res: Response) {
    const repo = AppDataSource.getRepository(Location);
    const location = repo.create(req.body);
    res.status(201).json(await repo.save(location));
  }

  static async updateLocation(req: Request, res: Response) {
    const repo = AppDataSource.getRepository(Location);
    await repo.update(req.params.id as string, req.body);
    res.json(await repo.findOneBy({ id: req.params.id as string }));
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

  static async getStaffById(req: Request, res: Response) {
    const repo = AppDataSource.getRepository(Staff);
    const staff = await repo.findOneBy({ id: req.params.id as string });
    if (!staff) return res.status(404).json({ error: 'Staff not found' });
    res.json(staff);
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

  /**
   * POST /staff/:id/leave
   * body: { start: string, end: string }
   * Appends a leave period to the staff member's leave_periods JSON array
   */
  static async addLeave(req: Request, res: Response) {
    const repo = AppDataSource.getRepository(Staff);
    const staff = await repo.findOneBy({ id: req.params.id as string });
    if (!staff) return res.status(404).json({ error: 'Staff not found' });

    const { start, end } = req.body;
    if (!start || !end) return res.status(400).json({ error: 'start and end dates are required' });

    staff.leave_periods = [...(staff.leave_periods || []), { start, end }];
    const saved = await repo.save(staff);
    res.json(saved);
  }

  // --- NOTIFICATIONS ---
  static async getNotifications(req: Request, res: Response) {
    const repo = AppDataSource.getRepository(Notification);
    res.json(await repo.find({ order: { createdAt: 'DESC' } }));
  }

  static async addNotification(req: Request, res: Response) {
    const repo = AppDataSource.getRepository(Notification);
    const notification = repo.create(req.body);
    res.status(201).json(await repo.save(notification));
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

import { Request, Response } from 'express';
import { EventService } from '../services/event.service';
import { AppDataSource } from '../config/database';
import { Staff } from '../entities/Staff';

const eventService = new EventService();

export class EventController {
  static async getEventsByBlock(req: Request, res: Response) {
    try {
      const events = await eventService.getAllByBlock(req.query.blockId as string);
      res.json(events);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch events' });
    }
  }

  static async createEvent(req: Request, res: Response) {
    try {
      const event = await eventService.createEvent(req.body);
      res.status(201).json(event);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  static async updateEvent(req: Request, res: Response) {
    try {
      const event = await eventService.updateEvent(req.params.id as string, req.body);
      res.json(event);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  static async deleteEvent(req: Request, res: Response) {
    try {
      await eventService.deleteEvent(req.params.id as string);
      res.status(204).send();
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  // --- MISSING ENDPOINT: getRota ---
  static async getRota(req: Request, res: Response) {
    try {
      const event = await AppDataSource.getRepository('EventInstance').findOne({ 
        where: { id: req.params.id }, 
        relations: ['assignments', 'block'] 
      });
      if (!event) return res.status(404).json({ error: 'Event not found' });
      
      // Compute mocked eligible staff array (for UI payload mirror)
      const eligible = await AppDataSource.getRepository(Staff).find();
      
      res.json({
        event,
        coverage: { required: (event as any).requiredStaffCount, confirmed: 0 },
        eligible: eligible.map(s => ({ staffId: s.id, isEligible: true, reasons: [] }))
      });
    } catch (error: any) {
      res.status(500).json({ error: 'Failed to load rota payload' });
    }
  }
}

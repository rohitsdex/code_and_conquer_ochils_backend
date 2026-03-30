import { Request, Response } from 'express';
import { EventService } from '../services/event.service';

const eventService = new EventService();

export class EventController {
  /**
   * GET /api/events?blockId=...
   * Returns all events for a block, fully hydrated with eventType, location, assignment.staff
   */
  static async getEventsByBlock(req: Request, res: Response) {
    try {
      const events = await eventService.getAllByBlock(req.query.blockId as string | undefined);
      res.json(events);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch events' });
    }
  }

  /**
   * GET /api/events/:id
   * Returns a single event hydrated with eventType, location, and assignment.staff
   * This is what getInstanceById() calls in the frontend.
   */
  static async getEventById(req: Request, res: Response) {
    try {
      const event = await eventService.getById(req.params.id as string);
      if (!event) return res.status(404).json({ error: 'Event not found' });
      res.json(event);
    } catch (error: any) {
      res.status(500).json({ error: 'Failed to fetch event' });
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
}

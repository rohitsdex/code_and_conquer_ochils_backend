import { AppDataSource } from '../config/database';
import { EventInstance } from '../entities/EventInstance';
import { EventType } from '../entities/EventType';
import { Location } from '../entities/Location';
import { Staff } from '../entities/Staff';
import { Block } from '../entities/Block';

export class EventService {
  private eventRepository = AppDataSource.getRepository(EventInstance);
  private blockRepository = AppDataSource.getRepository(Block);
  private eventTypeRepository = AppDataSource.getRepository(EventType);
  private locationRepository = AppDataSource.getRepository(Location);
  private staffRepository = AppDataSource.getRepository(Staff);

  /**
   * Hydrate an event with its eventType, location, and assignment.staff data
   * to match the shape the frontend expects.
   */
  private async hydrate(event: EventInstance): Promise<EventInstance> {
    const [eventType, location, allStaff] = await Promise.all([
      event.eventTypeId ? this.eventTypeRepository.findOneBy({ id: event.eventTypeId }) : null,
      event.locationId ? this.locationRepository.findOneBy({ id: event.locationId }) : null,
      this.staffRepository.find(),
    ]);

    const hydratedAssignments = (event.assignments ?? []).map(a => ({
      ...a,
      staff: allStaff.find(s => s.id === a.staffId) ?? null,
    }));

    return {
      ...event,
      eventType: eventType ?? undefined,
      location: location ?? undefined,
      assignments: hydratedAssignments,
    } as EventInstance;
  }

  async getAllByBlock(blockId?: string): Promise<EventInstance[]> {
    const where = blockId ? { blockId } : {};
    const events = await this.eventRepository.find({
      where,
      relations: ['assignments'],
      order: { date: 'ASC', startTime: 'ASC' },
    });
    return Promise.all(events.map(e => this.hydrate(e)));
  }

  async getById(id: string): Promise<EventInstance | null> {
    const event = await this.eventRepository.findOne({
      where: { id },
      relations: ['assignments', 'block'],
    });
    if (!event) return null;
    return this.hydrate(event);
  }

  async createEvent(data: Partial<EventInstance>): Promise<EventInstance> {
    const block = await this.blockRepository.findOneBy({ id: data.blockId });
    if (!block) throw new Error('Parent block not found');
    if (block.status === 'PUBLISHED') throw new Error('Cannot add events to a published block');

    const event = this.eventRepository.create(data);
    const saved = await this.eventRepository.save(event);
    return this.hydrate({ ...saved, assignments: [] });
  }

  async updateEvent(id: string, data: Partial<EventInstance>): Promise<EventInstance> {
    const event = await this.eventRepository.findOne({ where: { id }, relations: ['block', 'assignments'] });
    if (!event) throw new Error('Event not found');
    if (event.block?.status === 'PUBLISHED') throw new Error('Cannot edit events within a published block');

    Object.assign(event, data);
    const saved = await this.eventRepository.save(event);
    return this.hydrate(saved);
  }

  async deleteEvent(id: string): Promise<void> {
    const event = await this.eventRepository.findOne({ where: { id }, relations: ['block'] });
    if (!event) throw new Error('Event not found');
    if (event.block?.status === 'PUBLISHED') throw new Error('Cannot delete events within a published block');

    await this.eventRepository.remove(event);
  }
}

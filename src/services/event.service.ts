import { AppDataSource } from '../config/database';
import { EventInstance } from '../entities/EventInstance';
import { Block } from '../entities/Block';

export class EventService {
  private eventRepository = AppDataSource.getRepository(EventInstance);
  private blockRepository = AppDataSource.getRepository(Block);

  async getAllByBlock(blockId: string): Promise<EventInstance[]> {
    return this.eventRepository.find({
      where: { blockId },
      relations: ['assignments'],
      order: { date: 'ASC', startTime: 'ASC' }
    });
  }

  async createEvent(data: Partial<EventInstance>): Promise<EventInstance> {
    const block = await this.blockRepository.findOneBy({ id: data.blockId });
    if (!block) throw new Error('Parent block not found');
    if (block.status === 'PUBLISHED') throw new Error('Cannot add events to a published block');

    const event = this.eventRepository.create(data);
    return this.eventRepository.save(event);
  }

  async updateEvent(id: string, data: Partial<EventInstance>): Promise<EventInstance> {
    const event = await this.eventRepository.findOne({ where: { id }, relations: ['block'] });
    if (!event) throw new Error('Event not found');
    if (event.block?.status === 'PUBLISHED') throw new Error('Cannot edit events within a published block');

    Object.assign(event, data);
    return this.eventRepository.save(event);
  }

  async deleteEvent(id: string): Promise<void> {
    const event = await this.eventRepository.findOne({ where: { id }, relations: ['block'] });
    if (!event) throw new Error('Event not found');
    if (event.block?.status === 'PUBLISHED') throw new Error('Cannot delete events within a published block');

    await this.eventRepository.remove(event);
  }
}

import { AppDataSource } from '../config/database';
import { Block } from '../entities/Block';
import { EventInstance } from '../entities/EventInstance';
import { Assignment } from '../entities/Assignment';

export class BlockService {
  private blockRepository = AppDataSource.getRepository(Block);
  private eventRepository = AppDataSource.getRepository(EventInstance);
  private assignmentRepository = AppDataSource.getRepository(Assignment);

  async getAllBlocks(): Promise<Block[]> {
    return this.blockRepository.find({ order: { start_date: 'DESC' } });
  }

  async getBlockById(id: string): Promise<Block | null> {
    return this.blockRepository.findOne({ where: { id }, relations: ['events'] });
  }

  async createBlock(data: Partial<Block>): Promise<Block> {
    const block = this.blockRepository.create(data);
    block.status = 'DRAFT';
    return this.blockRepository.save(block);
  }

  async updateBlock(id: string, data: Partial<Block>): Promise<Block> {
    const block = await this.blockRepository.findOneBy({ id });
    if (!block) throw new Error('Block not found');
    if (block.status === 'PUBLISHED') throw new Error('Cannot edit a PUBLISHED block');

    Object.assign(block, data);
    return this.blockRepository.save(block);
  }

  async publishBlock(id: string, force: boolean = false): Promise<Block> {
    const block = await this.blockRepository.findOne({ where: { id }, relations: ['events'] });
    if (!block) throw new Error('Block not found');

    if (block.status === 'PUBLISHED') return block; // Idempotent

    if (!force) {
      const incompleteSessions: string[] = [];
      const statsPromises = block.events.map(async (event) => {
        // Fetch assignments for this event where confirmed
        const confirmedCount = await this.assignmentRepository.count({
          where: [
            { eventInstanceId: event.id, status: 'CONFIRMED' },
            { eventInstanceId: event.id, status: 'ACCEPTED' },
          ]
        });
        if (confirmedCount < event.requiredStaffCount) {
          incompleteSessions.push(event.id);
        }
      });
      await Promise.all(statsPromises);

      if (incompleteSessions.length > 0) {
        throw new Error(`INCOMPLETE_COVERAGE:${incompleteSessions.length}`);
      }
    }

    block.status = 'PUBLISHED';
    return this.blockRepository.save(block);
  }

  async deleteBlock(id: string): Promise<void> {
    const block = await this.blockRepository.findOneBy({ id });
    if (!block) throw new Error('Block not found');
    if (block.status === 'PUBLISHED') throw new Error('Cannot delete a PUBLISHED block');
    
    await this.blockRepository.remove(block);
  }
}

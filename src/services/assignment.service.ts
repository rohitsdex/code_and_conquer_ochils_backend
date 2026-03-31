import { AppDataSource } from '../config/database';
import { Assignment, AssignmentStatus } from '../entities/Assignment';
import { EventInstance } from '../entities/EventInstance';

export class AssignmentService {
  private assignmentRepository = AppDataSource.getRepository(Assignment);
  private eventRepository = AppDataSource.getRepository(EventInstance);

  async getAssignmentsByEvent(eventInstanceId: string): Promise<Assignment[]> {
    return this.assignmentRepository.find({
      where: { eventInstanceId },
      // relations: ['staff'] -> add Staff relation when fully implemented
    });
  }

  async assignStaff(eventInstanceId: string, staffId: string, status: AssignmentStatus = 'INVITED'): Promise<Assignment> {
    const event = await this.eventRepository.findOne({ where: { id: eventInstanceId }, relations: ['block'] });
    if (!event) throw new Error('Event not found');

    const assignment = this.assignmentRepository.create({
      eventInstanceId,
      staffId,
      status,
      assignedAt: new Date()
    });

    return this.assignmentRepository.save(assignment);
  }

  async updateAssignmentStatus(id: string, status: AssignmentStatus): Promise<Assignment> {
    const assignment = await this.assignmentRepository.findOne({ where: { id }, relations: ['eventInstance', 'eventInstance.block'] });
    if (!assignment) throw new Error('Assignment not found');

    assignment.status = status;
    return this.assignmentRepository.save(assignment);
  }

  async removeAssignment(id: string): Promise<void> {
    const assignment = await this.assignmentRepository.findOne({ where: { id }, relations: ['eventInstance', 'eventInstance.block'] });
    if (!assignment) throw new Error('Assignment not found');

    await this.assignmentRepository.remove(assignment);
  }
}

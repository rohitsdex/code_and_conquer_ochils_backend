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
    if (event.block?.status === 'PUBLISHED') throw new Error('Cannot modify assignments for a published block');

    // Here is where the complete Constraint Engine evaluates 
    // Shift Overlap + External Bookio/Zoho + Working Hours Caps
    // Example: await ConstraintsEngine.verify(staffId, eventInstanceId);

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
    
    // Once published, staff status shifts shouldn't be allowed unless via a special explicit override
    if (assignment.eventInstance?.block?.status === 'PUBLISHED') {
      throw new Error('Cannot modify staff status on mathematically locked payroll blocks');
    }

    assignment.status = status;
    return this.assignmentRepository.save(assignment);
  }

  async removeAssignment(id: string): Promise<void> {
    const assignment = await this.assignmentRepository.findOne({ where: { id }, relations: ['eventInstance', 'eventInstance.block'] });
    if (!assignment) throw new Error('Assignment not found');
    if (assignment.eventInstance?.block?.status === 'PUBLISHED') {
      throw new Error('Cannot modify staff assignment on mechanically locked payroll blocks');
    }

    await this.assignmentRepository.remove(assignment);
  }
}

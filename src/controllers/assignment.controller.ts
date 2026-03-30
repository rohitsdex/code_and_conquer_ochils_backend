import { Request, Response } from 'express';
import { AssignmentService } from '../services/assignment.service';
import { AppDataSource } from '../config/database';
import { Staff } from '../entities/Staff';
import { EventInstance } from '../entities/EventInstance';
import { EventType } from '../entities/EventType';

const assignmentService = new AssignmentService();

export class AssignmentController {
  static async getAssignmentsByEvent(req: Request, res: Response) {
    try {
      const assignments = await assignmentService.getAssignmentsByEvent(req.params.eventInstanceId as string);
      res.json(assignments);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch assignments' });
    }
  }

  static async assignStaff(req: Request, res: Response) {
    const { staffId, status } = req.body;
    try {
      const assignment = await assignmentService.assignStaff(req.params.eventInstanceId as string, staffId, status);
      res.status(201).json(assignment);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  static async updateAssignmentStatus(req: Request, res: Response) {
    const { status } = req.body;
    try {
      const assignment = await assignmentService.updateAssignmentStatus(req.params.id as string, status);
      res.json(assignment);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  static async removeAssignment(req: Request, res: Response) {
    try {
      await assignmentService.removeAssignment(req.params.id as string);
      res.status(204).send();
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  /**
   * GET /api/assignments/event/:eventInstanceId/eligible
   * Returns StaffEligibility[] matching the frontend interface:
   * { staff: Staff, eligible: boolean, reasons: string[] }
   *
   * Runs basic eligibility checks: availability by weekday, leave periods, qualifications.
   */
  static async getEligibleStaff(req: Request, res: Response) {
    try {
      const eventId = req.params.eventInstanceId as string;
      const eventRepo = AppDataSource.getRepository(EventInstance);
      const staffRepo = AppDataSource.getRepository(Staff);
      const etRepo = AppDataSource.getRepository(EventType);

      const event = await eventRepo.findOne({ where: { id: eventId }, relations: ['assignments'] });
      if (!event) return res.status(404).json({ error: 'Event not found' });

      const eventType = event.eventTypeId
        ? await etRepo.findOneBy({ id: event.eventTypeId })
        : null;

      const allStaff = await staffRepo.find();
      const eventDayOfWeek = new Date(event.date + 'T00:00:00').getDay(); // 0=Sun … 6=Sat
      const activeAssignments = (event.assignments ?? []).filter(
        a => a.status !== 'REJECTED'
      );

      const toMinutes = (t: string) => {
        const [h, m] = t.split(':').map(Number);
        return h * 60 + m;
      };

      const result = allStaff.map(staff => {
        const reasons: string[] = [];

        // Qualification check
        if (eventType && eventType.qualifications && eventType.qualifications.length > 0) {
          const quals = Array.isArray(staff.qualifications)
            ? staff.qualifications
            : (staff.qualifications as any as string).split(',').map((q: string) => q.trim()).filter(Boolean);
          const hasQual = eventType.qualifications.some((q: string) => quals.includes(q));
          if (!hasQual) reasons.push('QUALIFICATION_REQUIRED');
        }

        // Category-specific qualification check
        if (event.session_category === 'ASC') {
          const quals = Array.isArray(staff.qualifications) ? staff.qualifications : [];
          if (!quals.includes('asc') && !reasons.includes('QUALIFICATION_REQUIRED')) {
            reasons.push('QUALIFICATION_REQUIRED');
          }
        }
        if (event.session_category === 'DRAMA') {
          const quals = Array.isArray(staff.qualifications) ? staff.qualifications : [];
          if (!quals.includes('drama') && !reasons.includes('QUALIFICATION_REQUIRED')) {
            reasons.push('QUALIFICATION_REQUIRED');
          }
        }

        // Availability check
        const availability = Array.isArray(staff.availability)
          ? staff.availability
          : (typeof staff.availability === 'string' ? JSON.parse(staff.availability || '[]') : []);
        const isAvailable = availability.some((a: any) => a.dayOfWeek === eventDayOfWeek);
        if (!isAvailable) reasons.push('UNAVAILABLE');

        // Leave check
        const leavePeriods = Array.isArray(staff.leave_periods)
          ? staff.leave_periods
          : (typeof staff.leave_periods === 'string' ? JSON.parse(staff.leave_periods || '[]') : []);
        const eventDate = new Date(event.date + 'T00:00:00');
        const onLeave = leavePeriods.some((lp: any) => {
          const start = new Date(lp.start);
          const end = new Date(lp.end);
          return eventDate >= start && eventDate <= end;
        });
        if (onLeave) reasons.push('LEAVE');

        // Already assigned check
        if (activeAssignments.some(a => a.staffId === staff.id)) {
          reasons.push('ALREADY_ASSIGNED');
        }

        // Weekly hours cap check
        const sessionHours =
          (toMinutes(event.endTime) - toMinutes(event.startTime)) / 60;
        if (staff.currentWeeklyHours + sessionHours > staff.weekly_hours_cap) {
          reasons.push('OVERLOADED');
        }

        return {
          staff,
          eligible: reasons.length === 0,
          reasons,
        };
      });

      res.json(result);
    } catch (error: any) {
      res.status(500).json({ error: 'Constraint engine failure: ' + error.message });
    }
  }
}

import { Request, Response } from 'express';
import { AssignmentService } from '../services/assignment.service';
import { AppDataSource } from '../config/database';
import { Staff } from '../entities/Staff';

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

  // --- MISSING ENDPOINT: getEligibleStaff ---
  static async getEligibleStaff(req: Request, res: Response) {
    try {
      // Logic for computing constraints across all staff vs this target event
      const allStaff = await AppDataSource.getRepository(Staff).find();
      const mockResult = allStaff.map(staff => ({
        staffId: staff.id,
        isEligible: true,
        reasons: [] // Constraint Engine outputs map here (e.g. EXTERNAL_CONFLICT)
      }));
      res.json(mockResult);
    } catch (error: any) {
      res.status(500).json({ error: 'Constraint engine failure' });
    }
  }
}

import { Router } from 'express';
import { AssignmentController } from '../controllers/assignment.controller';

const router = Router();

// Notice: In a REST structure, POST to create might be on the /events/:id route
// but we map it directly through assignment endpoint for generic API building
router.get('/event/:eventInstanceId', AssignmentController.getAssignmentsByEvent);
router.post('/event/:eventInstanceId/assign', AssignmentController.assignStaff);
router.put('/:id/status', AssignmentController.updateAssignmentStatus);
router.delete('/:id', AssignmentController.removeAssignment);

export default router;

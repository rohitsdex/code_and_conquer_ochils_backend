import { Router } from 'express';
import { EventController } from '../controllers/event.controller';

const router = Router();

router.get('/', EventController.getEventsByBlock); // Pass ?blockId=
router.post('/', EventController.createEvent);
router.put('/:id', EventController.updateEvent);
router.delete('/:id', EventController.deleteEvent);

export default router;

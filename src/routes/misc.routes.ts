import { Router } from 'express';
import { MiscController } from '../controllers/misc.controller';

const router = Router();

router.get('/locations', MiscController.getLocations);
router.get('/eventTypes', MiscController.getEventTypes);
router.get('/staff', MiscController.getStaff);
router.get('/notifications', MiscController.getNotifications);

export default router;

import { Router } from 'express';
import { MiscController } from '../controllers/misc.controller';

const router = Router();

// LOCATIONS
router.get('/locations', MiscController.getLocations);
router.post('/locations', MiscController.createLocation);
router.delete('/locations/:id', MiscController.deleteLocation);

// EVENT TYPES
router.get('/eventTypes', MiscController.getEventTypes);
router.post('/eventTypes', MiscController.createEventType);
router.put('/eventTypes/:id', MiscController.updateEventType);
router.delete('/eventTypes/:id', MiscController.deleteEventType);

// STAFF
router.get('/staff', MiscController.getStaff);
router.post('/staff', MiscController.createStaff);
router.put('/staff/:id', MiscController.updateStaff);
router.delete('/staff/:id', MiscController.deleteStaff);

// NOTIFICATIONS
router.get('/notifications', MiscController.getNotifications);
router.put('/notifications/:id/read', MiscController.markNotificationRead);
router.put('/notifications/readAll', MiscController.markAllNotificationsRead);

export default router;

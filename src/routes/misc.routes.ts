import { Router } from 'express';
import { MiscController } from '../controllers/misc.controller';

const router = Router();

// LOCATIONS
router.get('/locations', MiscController.getLocations);
router.get('/locations/:id', MiscController.getLocationById);
router.post('/locations', MiscController.createLocation);
router.put('/locations/:id', MiscController.updateLocation);
router.delete('/locations/:id', MiscController.deleteLocation);

// EVENT TYPES
router.get('/eventTypes', MiscController.getEventTypes);
router.post('/eventTypes', MiscController.createEventType);
router.put('/eventTypes/:id', MiscController.updateEventType);
router.delete('/eventTypes/:id', MiscController.deleteEventType);

// STAFF
router.get('/staff', MiscController.getStaff);
router.get('/staff/:id', MiscController.getStaffById);
router.post('/staff', MiscController.createStaff);
router.put('/staff/:id', MiscController.updateStaff);
router.delete('/staff/:id', MiscController.deleteStaff);
router.post('/staff/:id/leave', MiscController.addLeave);

// NOTIFICATIONS
router.get('/notifications', MiscController.getNotifications);
router.post('/notifications', MiscController.addNotification);
// NOTE: /notifications/readAll must be before /:id/read to avoid route conflict
router.put('/notifications/readAll', MiscController.markAllNotificationsRead);
router.put('/notifications/:id/read', MiscController.markNotificationRead);

export default router;

/**
 * Seed Script: Populates the SQLite DB with all mock data
 * Run with: npx ts-node src/seed.ts
 */
import 'reflect-metadata';
import { AppDataSource } from './config/database';
import { Location } from './entities/Location';
import { EventType } from './entities/EventType';
import { Staff } from './entities/Staff';
import { Block } from './entities/Block';
import { EventInstance } from './entities/EventInstance';
import { Assignment } from './entities/Assignment';
import { Notification } from './entities/Notification';

// ===== MOCK DATA =====

const mockLocations = [
  { name: 'Community Hall A', address: '12 Main Road, Sector 5', capacity: 100 },
  { name: 'Training Center', address: '45 Education Lane', capacity: 40 },
  { name: 'Field Office', address: '78 Outreach Blvd', capacity: 20 },
  { name: 'Center B', address: '23 Wellness Park', capacity: 30 },
  { name: 'Village Outpost', address: 'Rural Block 3', capacity: 50 },
  { name: 'Mobile Unit', address: 'On-site deployment', capacity: 15 },
];

const mockEventTypes = [
  {
    name: 'ASC Support Session',
    description: 'After School Club — requires ASC-qualified staff',
    qualifications: ['asc'],
    defaultStaffCount: 3,
    durationMinutes: 240,
    color: '#2563eb',
    session_category: 'ASC',
  },
  {
    name: 'Skills Training',
    description: 'Friday skills training for all active staff',
    qualifications: ['first-aid'],
    defaultStaffCount: 2,
    durationMinutes: 120,
    color: '#16a34a',
    session_category: 'GENERAL',
  },
  {
    name: 'General Session',
    description: 'Standard community sessions',
    qualifications: [],
    defaultStaffCount: 4,
    durationMinutes: 300,
    color: '#ea580c',
    session_category: 'GENERAL',
  },
  {
    name: 'Drama Workshop',
    description: 'Drama-based youth engagement activities',
    qualifications: ['drama'],
    defaultStaffCount: 2,
    durationMinutes: 120,
    color: '#9333ea',
    session_category: 'DRAMA',
  },
];

const mockStaff = [
  {
    name: 'Priya Sharma', email: 'priya@oyci.org.uk', employee_id: 'EMP-001',
    staff_type: 'FULLTIME' as const, designation: 'YOUTH_WORKER' as const,
    department: 'Youth Work', qualifications: ['first-aid', 'asc', 'counseling'],
    availability: [1, 2, 3, 4, 5].map(d => ({ dayOfWeek: d, startTime: '09:00', endTime: '17:00' })),
    weekly_hours_cap: 40, currentWeeklyHours: 28, hourly_rate: 18, leave_periods: [],
  },
  {
    name: 'Rahul Mehta', email: 'rahul@oyci.org.uk', employee_id: 'EMP-002',
    staff_type: 'FULLTIME' as const, designation: 'YOUTH_WORKER' as const,
    department: 'Youth Work', qualifications: ['first-aid', 'asc'],
    availability: [1, 2, 3, 4, 5].map(d => ({ dayOfWeek: d, startTime: '08:00', endTime: '16:00' })),
    weekly_hours_cap: 40, currentWeeklyHours: 36, hourly_rate: 16, leave_periods: [],
  },
  {
    name: 'Anita Desai', email: 'anita@oyci.org.uk', employee_id: 'EMP-003',
    staff_type: 'HOURLY' as const, designation: 'SESSION_SUPPORT' as const,
    department: 'Support Services', qualifications: ['counseling', 'drama'],
    availability: [1, 3, 5].map(d => ({ dayOfWeek: d, startTime: '10:00', endTime: '15:00' })),
    weekly_hours_cap: 20, currentWeeklyHours: 12, hourly_rate: 15, leave_periods: [],
  },
  {
    name: 'Vikram Joshi', email: 'vikram@oyci.org.uk', employee_id: 'EMP-004',
    staff_type: 'HOURLY' as const, designation: 'YOUTH_WORKER' as const,
    department: 'Youth Work', qualifications: ['first-aid', 'asc', 'counseling'],
    availability: [2, 4, 6].map(d => ({ dayOfWeek: d, startTime: '09:00', endTime: '18:00' })),
    weekly_hours_cap: 15, currentWeeklyHours: 6, hourly_rate: 24, leave_periods: [],
  },
  {
    name: 'Meera Patel', email: 'meera@oyci.org.uk', employee_id: 'EMP-005',
    staff_type: 'HOURLY' as const, designation: 'YOUTH_WORKER' as const,
    department: 'Youth Work', qualifications: ['counseling', 'drama'],
    availability: [1, 2, 3, 4, 5].map(d => ({ dayOfWeek: d, startTime: '09:00', endTime: '13:00' })),
    weekly_hours_cap: 20, currentWeeklyHours: 8, hourly_rate: 22, leave_periods: [],
  },
  {
    name: 'Arjun Singh', email: 'arjun@oyci.org.uk', employee_id: 'EMP-006',
    staff_type: 'HOURLY' as const, designation: 'MANAGEMENT' as const,
    department: 'Operations', qualifications: ['first-aid'],
    availability: [1, 2, 3].map(d => ({ dayOfWeek: d, startTime: '07:00', endTime: '15:00' })),
    weekly_hours_cap: 24, currentWeeklyHours: 22, hourly_rate: 13, leave_periods: [],
  },
  {
    name: 'Emily Carter', email: 'emily@oyci.org.uk', employee_id: 'EMP-007',
    staff_type: 'FULLTIME' as const, designation: 'YOUTH_WORKER' as const,
    department: 'Youth Work', qualifications: ['counseling', 'drama', 'asc'],
    availability: [1, 2, 3, 4, 5].map(d => ({ dayOfWeek: d, startTime: '09:00', endTime: '17:00' })),
    weekly_hours_cap: 40, currentWeeklyHours: 30, hourly_rate: 21, leave_periods: [],
  },
  {
    name: 'James Walker', email: 'james@oyci.org.uk', employee_id: 'EMP-008',
    staff_type: 'HOURLY' as const, designation: 'VOLUNTEER' as const,
    department: 'Community', qualifications: ['first-aid'],
    availability: [2, 3, 4].map(d => ({ dayOfWeek: d, startTime: '10:00', endTime: '18:00' })),
    weekly_hours_cap: 20, currentWeeklyHours: 10, hourly_rate: 14, leave_periods: [],
  },
  {
    name: 'Sophia Khan', email: 'sophia@oyci.org.uk', employee_id: 'EMP-009',
    staff_type: 'HOURLY' as const, designation: 'YOUTH_WORKER' as const,
    department: 'Youth Work', qualifications: ['asc', 'counseling'],
    availability: [1, 5].map(d => ({ dayOfWeek: d, startTime: '09:00', endTime: '17:00' })),
    weekly_hours_cap: 16, currentWeeklyHours: 6, hourly_rate: 28, leave_periods: [],
  },
];

// Helper to get week dates (Mon-Sun of current week)
function getWeekDates(): string[] {
  const today = new Date();
  const monday = new Date(today);
  monday.setDate(today.getDate() - today.getDay() + 1);
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return d.toISOString().split('T')[0];
  });
}

async function seed() {
  await AppDataSource.initialize();
  console.log('✅ Database connected');

  // Clear existing data (in FK order to respect constraints)
  await AppDataSource.getRepository(Notification).clear();
  await AppDataSource.getRepository(Assignment).clear();
  await AppDataSource.getRepository(EventInstance).clear();
  await AppDataSource.getRepository(Block).clear();
  await AppDataSource.getRepository(Staff).clear();
  await AppDataSource.getRepository(EventType).clear();
  await AppDataSource.getRepository(Location).clear();
  console.log('🗑️  Cleared existing data');

  // Seed Locations
  const locationRepo = AppDataSource.getRepository(Location);
  const savedLocations = await locationRepo.save(mockLocations.map(l => locationRepo.create(l)));
  console.log(`📍 Seeded ${savedLocations.length} locations`);

  // Seed Event Types
  const eventTypeRepo = AppDataSource.getRepository(EventType);
  const savedEventTypes = await eventTypeRepo.save(mockEventTypes.map(et => eventTypeRepo.create(et)));
  console.log(`📅 Seeded ${savedEventTypes.length} event types`);

  // Seed Staff
  const staffRepo = AppDataSource.getRepository(Staff);
  const savedStaff = await staffRepo.save(mockStaff.map(s => staffRepo.create(s)));
  console.log(`👥 Seeded ${savedStaff.length} staff`);

  // Seed Blocks
  const blockRepo = AppDataSource.getRepository(Block);
  const savedBlocks = await blockRepo.save([
    blockRepo.create({
      name: 'Easter Holidays 2026', start_date: '2026-04-01', end_date: '2026-04-17',
      status: 'DRAFT', friday_training_start_time: '15:00',
    }),
    blockRepo.create({
      name: 'Spring Term 2026', start_date: '2026-01-06', end_date: '2026-03-28',
      status: 'PUBLISHED', friday_training_start_time: '15:00',
    }),
  ]);
  console.log(`📦 Seeded ${savedBlocks.length} blocks`);

  // Seed Event Instances
  const dates = getWeekDates();
  const eventInstanceRepo = AppDataSource.getRepository(EventInstance);
  const eventInstancesData = [
    { blockId: savedBlocks[0].id, eventTypeId: savedEventTypes[0].id, date: dates[0], startTime: '09:00', endTime: '13:00', locationId: savedLocations[0].id, requiredStaffCount: 3, session_category: 'ASC' },
    { blockId: savedBlocks[0].id, eventTypeId: savedEventTypes[1].id, date: dates[1], startTime: '15:00', endTime: '17:00', locationId: savedLocations[1].id, requiredStaffCount: 2, session_category: 'GENERAL' },
    { blockId: savedBlocks[0].id, eventTypeId: savedEventTypes[2].id, date: dates[2], startTime: '08:00', endTime: '13:00', locationId: savedLocations[2].id, requiredStaffCount: 4, session_category: 'GENERAL' },
    { blockId: savedBlocks[0].id, eventTypeId: savedEventTypes[3].id, date: dates[3], startTime: '14:00', endTime: '16:00', locationId: savedLocations[3].id, requiredStaffCount: 2, session_category: 'DRAMA' },
    { blockId: savedBlocks[0].id, eventTypeId: savedEventTypes[2].id, date: dates[4], startTime: '09:00', endTime: '14:00', locationId: savedLocations[4].id, requiredStaffCount: 4, session_category: 'GENERAL' },
    { blockId: savedBlocks[0].id, eventTypeId: savedEventTypes[0].id, date: dates[5], startTime: '10:00', endTime: '14:00', locationId: savedLocations[5].id, requiredStaffCount: 3, session_category: 'ASC' },
  ];
  const savedInstances = await eventInstanceRepo.save(eventInstancesData.map(e => eventInstanceRepo.create(e)));
  console.log(`🎯 Seeded ${savedInstances.length} event instances`);

  // Seed Assignments 
  const assignmentRepo = AppDataSource.getRepository(Assignment);
  const assignmentData = [
    { eventInstanceId: savedInstances[0].id, staffId: savedStaff[0].id, status: 'CONFIRMED' as const, assignedAt: new Date(dates[0]) },
    { eventInstanceId: savedInstances[0].id, staffId: savedStaff[1].id, status: 'CONFIRMED' as const, assignedAt: new Date(dates[0]) },
    { eventInstanceId: savedInstances[1].id, staffId: savedStaff[3].id, status: 'INVITED' as const, assignedAt: new Date(dates[1]) },
    { eventInstanceId: savedInstances[2].id, staffId: savedStaff[2].id, status: 'CONFIRMED' as const, assignedAt: new Date(dates[2]) },
    { eventInstanceId: savedInstances[3].id, staffId: savedStaff[0].id, status: 'CONFIRMED' as const, assignedAt: new Date(dates[3]) },
    { eventInstanceId: savedInstances[3].id, staffId: savedStaff[4].id, status: 'INVITED' as const, assignedAt: new Date(dates[3]) },
    { eventInstanceId: savedInstances[4].id, staffId: savedStaff[5].id, status: 'CONFIRMED' as const, assignedAt: new Date(dates[4]) },
  ];
  const savedAssignments = await assignmentRepo.save(assignmentData.map(a => assignmentRepo.create(a)));
  console.log(`📋 Seeded ${savedAssignments.length} assignments`);

  // Seed Notifications
  const notifRepo = AppDataSource.getRepository(Notification);
  const notifData = [
    { type: 'ASSIGNMENT' as const, title: 'Staff Assigned', message: `Priya Sharma assigned to ASC Support Session on ${dates[0]}`, read: false, linkTo: `/events/${savedInstances[0].id}`, recipientRole: 'ADMIN' as const },
    { type: 'INVITE' as const, title: 'Invite Sent', message: 'Invitation sent to Vikram Joshi for Skills Training', read: false, linkTo: `/events/${savedInstances[1].id}`, emailSent: true, recipientRole: 'ADMIN' as const },
    { type: 'EMAIL_SENT' as const, title: 'Email Delivered', message: 'Invitation email delivered to vikram@oyci.org.uk', read: true, recipientRole: 'ADMIN' as const },
    { type: 'INVITE' as const, title: 'You Have Been Invited', message: `You have been invited to Skills Training on ${dates[1]}. Please respond.`, read: false, linkTo: `/events/${savedInstances[1].id}`, recipientRole: 'STAFF' as const },
    { type: 'INVITE_RESPONSE' as const, title: 'Pending Invite', message: 'Meera Patel has a pending invite for Drama Workshop', read: false, linkTo: `/events/${savedInstances[3].id}`, emailSent: true, recipientRole: 'ADMIN' as const },
    { type: 'EVENT_UPDATE' as const, title: 'Session Understaffed', message: `General Session on ${dates[4]} needs more staff`, read: false, linkTo: `/events/${savedInstances[4].id}`, recipientRole: 'ALL' as const },
    { type: 'SYSTEM' as const, title: 'Welcome to OYCI Scheduler', message: 'Ochils Youth Community Improvement — Staff scheduling & planning made simple', read: true, linkTo: '/', recipientRole: 'ALL' as const },
  ];
  await notifRepo.save(notifData.map(n => notifRepo.create(n)));
  console.log(`🔔 Seeded ${notifData.length} notifications`);

  console.log('\n✅ Seed complete! Database is now populated with mock data.');
  process.exit(0);
}

seed().catch(err => {
  console.error('❌ Seed failed:', err);
  process.exit(1);
});

import 'reflect-metadata';
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { AppDataSource } from './config/database';
import blockRoutes from './routes/block.routes';
import eventRoutes from './routes/event.routes';
import assignmentRoutes from './routes/assignment.routes';
import miscRoutes from './routes/misc.routes';
import swaggerUi from 'swagger-ui-express';
import * as swaggerDocument from '../swagger.json';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

// Basic healthcheck
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'StaffFlow Scheduling Engine API is running' });
});

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use('/api/blocks', blockRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/assignments', assignmentRoutes);

app.use('/api', miscRoutes); // Automatically makes /api/locations, /api/staff, etc

AppDataSource.initialize()
  .then(() => {
    console.log('Database connected successfully');
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  })
  .catch((error) => console.log('Database connection failed', error));

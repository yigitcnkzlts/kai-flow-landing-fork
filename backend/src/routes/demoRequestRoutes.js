import express from 'express';
import {
  createDemoRequest,
  getDemoRequests,
  getDemoRequestById,
} from '../controllers/demoRequestController.js';

const router = express.Router();

// POST - Create new demo request
router.post('/', createDemoRequest);

// GET - Fetch all demo requests
router.get('/', getDemoRequests);

// GET - Fetch demo request by ID
router.get('/:id', getDemoRequestById);

export default router;

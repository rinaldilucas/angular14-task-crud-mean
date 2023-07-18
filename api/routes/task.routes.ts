import { Router } from 'express';
import { check } from 'express-validator';

import authMiddleware from '@middlewares/auth.middleware';
import { verifyValidations } from '@middlewares/validator.middleware';

import Controller from '@controllers/task.controller';

const routes = Router();

// FIND ALL
routes.get('/api/tasks', authMiddleware, Controller.findAll);

// CREATE
routes.post(
  '/api/tasks',
  check('title', 'Must be at least 2 and lesser than 100 chars long.').isLength({ min: 2 }).isLength({ max: 100 }).not().isEmpty().trim(),
  check('description', 'Must be lesser than 300 chars long').isLength({ max: 300 }).trim(),
  verifyValidations,
  authMiddleware,
  Controller.create,
);

// UPDATE
routes.put('/api/tasks', authMiddleware, Controller.update);

// DELETE
routes.delete('/api/tasks/:_id', authMiddleware, Controller.remove);

// GET BY ID
routes.get('/api/tasks/:_id', authMiddleware, Controller.findOne);

export default routes;

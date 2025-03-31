import express from 'express';
import {webhookRouter} from './webhook';
import {sessionRouter} from './session';
const router = express.Router();

router.use('/webhook', webhookRouter);
router.use('/api', sessionRouter);

export {router as routes};

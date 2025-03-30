import express from 'express';
import {webhookRouter} from './webhook';
const router = express.Router();

router.use('/webhook', webhookRouter);
router.use('/api', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Request received'
    });
});

export {router as routes};

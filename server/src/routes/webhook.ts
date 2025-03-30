import express, { Request, Response } from 'express';
import { processRecording } from '../controller/recordingController';

const router = express.Router();

router.post('/recordings', async (req: Request, res: Response) => {
    try{
        const { recordingUrl } = req.body;
        const result = await processRecording(recordingUrl);
        res.status(200).json({
            success: true,
            message: 'Recording processed successfully',
            data: result
        });
    }catch(error){
        console.error('Error processing recording:', error);
        res.status(500).json({
            success: false,
            message: 'Error processing recording',
            error: error
        });
    }
});


export { router as webhookRouter }; 
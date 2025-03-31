import express, { Request, Response } from 'express';
import { processRecording } from '../controller/recordingController';
import CallDetails from '../models/callDetails';

const router = express.Router();

router.post('/recordings', async (req: Request, res: Response) => {
    try{
        const { recording_presigned_url:recordingUrl, session_id:sessionId } = req.body;
        const callDetails = await CallDetails.find({sessionId: sessionId});
        if(!callDetails){
            return res.status(404).json({
                success: false,
                message: 'Call details not found',
            });
        }

        callDetails[0].recordingUrl = recordingUrl;
        await callDetails[0].save();

        const result = await processRecording(recordingUrl, sessionId);
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

router.post('/session-start', async (req: Request, res: Response) => {
    try {
        const { session_id: sessionId, session_started_at: sessionStartedAt } = req.body;
        const callDetails = new CallDetails({
            sessionId,
            sessionStartedAt,
        });
        await callDetails.save();
        res.status(200).json({});
            
    } catch (error) {
        console.error('Error starting session:', error);
        res.status(500).json({
            success: false,
            message: 'Error starting session',
            error: error,
        });
    }
});


export { router as webhookRouter }; 
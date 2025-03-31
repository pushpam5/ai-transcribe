import express, {Request, Response} from 'express';
import CallDetails from '../models/callDetails';


const router = express.Router();

router.get('/sessions', async (_, res: Response) => {
    try {
        const sessions = await CallDetails.find().select('sessionId sessionStartedAt');
        res.status(200).json({
            success: true,
            data: sessions,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching sessions',
        });
    }
});

router.get('/sessions/:sessionId', async (req: Request, res: Response) => {
    try {
        const { sessionId } = req.params;
        const session = await CallDetails.findOne({sessionId: sessionId});
        
        if (!session) {
            return res.status(404).json({
                success: false,
                message: 'Session not found',
            });
        }

        res.status(200).json({
            success: true,
            data: session,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching session',
        });
    }
});

export { router as sessionRouter };
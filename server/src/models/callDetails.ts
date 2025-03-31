import mongoose, { Document, Schema } from 'mongoose';

interface ICallDetails extends Document {
    sessionId: string;
    sessionStartedAt: Date;
    recordingUrl: string;
    transcription: string;
    soapNote: string;
}

const callDetailsSchema = new Schema({
    sessionId: {
        type: String,
        required: true,
    },
    sessionStartedAt: {
        type: Date,
        required: true,
    },
    recordingUrl: {
        type: String,
    },
    transcription: {
        type: String,
    },
    soapNote: {
        type: String,
    },
}, { timestamps: true });

const CallDetails = mongoose.model<ICallDetails>('CallDetails', callDetailsSchema);

export default CallDetails;


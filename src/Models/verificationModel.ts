import { Schema, model, Document, Model } from 'mongoose';
import { IUser } from './user';

export interface IVerificationToken extends Document {
    user: IUser['_id'];
    token: string;
    isActive: boolean;
    expiresAt: Date;
}

const verificationTokenSchema = new Schema<IVerificationToken>({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    token: {
        type: String,
        required: true
    },
    isActive: {
        type: Boolean,
        default: true
    },
    expiresAt: {
        type: Date,
        required: true
    }
}, {
    timestamps: true
});

const VerificationToken = model<IVerificationToken>('VerificationToken', verificationTokenSchema);

export default VerificationToken;
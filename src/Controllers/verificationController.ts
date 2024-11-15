import VerificationToken from '../Models/verificationModel';

export const verifyAccount = async (token: string): Promise<{ message: string } | { error: string }> => {
    try {
        const verificationToken = await VerificationToken.findOne({ token, isActive: true, expiresAt: { $gt: new Date() } }).populate('user');

        if (!verificationToken) {
            return { error: 'Invalid or expired token' };
        }

        verificationToken.isActive = false;
        await verificationToken.save();

        return { message: 'Account verified' };
    } catch (error) {
        console.error('Error verifying account:', error);
        return { error: 'Internal Server Error' };
    }
};
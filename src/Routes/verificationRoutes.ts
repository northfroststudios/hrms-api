import express, { Request, Response, RequestHandler } from 'express';
import { body, validationResult } from 'express-validator';
import { verifyAccount } from '../Controllers/verificationController';
import { sendMail } from '../Utils/mailer';

const router = express.Router();

// Account verification handler
interface VerifyAccountRequestBody {
    token: string;
}
interface VerifyAccountRequest extends Request<{}, {}, VerifyAccountRequestBody> {}

const verifyAccountHandler: RequestHandler = async (
    req: Request<{}, {}, VerifyAccountRequestBody>,
    res: Response<{ message: string } | { error: string }>
): Promise<void> => {
    try {
        const { token } = req.body;

        const verificationResult = await verifyAccount(token);

        if ('error' in verificationResult) {
            res.status(400).json({ error: verificationResult.error });
            return;
        }

        res.status(200).json({ message: verificationResult.message });
    } catch (error) {
        console.error("Error during account verification:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

// Verification route
router.post("/verify", verifyAccountHandler);

export default router;
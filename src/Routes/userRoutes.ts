import { Request, Response, Router, RequestHandler } from "express";
import crypto from "crypto";
import {
  loginUser,
  registerUser,
  verifyAccount,
} from "../Controllers/userController";
import auth, { CustomRequest } from "../Middleware/auth";
import { IUser } from "../Models/user";
import User from "../Models/user";
import { sendMail } from "../Utils/mailer";

const router = Router();

const registerHandler: RequestHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userData = {
      firstname: req.body.firstname as string,
      lastname: req.body.lastname as string,
      email: req.body.email as string,
      password: req.body.password as string,
    };

    const registeredUser = await registerUser(userData);

    if (registeredUser.error) {
      res.status(400).json({ error: registeredUser.error });
      return;
    }
    res.status(201).json(registeredUser);
  } catch (error) {
    console.error("Error during registration:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const loginHandler: RequestHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userData: Partial<IUser> = {
      email: req.body.email as string,
      password: req.body.password as string,
    };

    const loggedInUser = await loginUser(userData);

    if (loggedInUser?.error) {
      res.status(400).json({ error: loggedInUser?.error });
      return;
    }

    res.status(200).json(loggedInUser);
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

interface VerifyAccountRequestParams {
  token: string;
}

interface VerifyAccountRequest extends Request<VerifyAccountRequestParams> {}

const verifyAccountHandler: RequestHandler<VerifyAccountRequestParams> = async (
  req: VerifyAccountRequest,
  res: Response<{ message: string } | { error: string }>
): Promise<void> => {
  try {
    const { token } = req.params;

    const verificationResult = await verifyAccount(token);

    if ("error" in verificationResult) {
      res.status(400).json({ error: verificationResult.error });
      return;
    }

    res.status(200).json({ message: verificationResult.message });
  } catch (error) {
    console.error("Error during account verification:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Resend verification email 
export const resendVerificationHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    if (user.isActive) {
      res.status(400).json({ error: "Account is already verified" });
      return;
    }

    const token = crypto.randomBytes(20).toString("hex");
    user.authToken = token;
    user.authTokenExpires = new Date(Date.now() + 300000);
    const verifyLink = `http://localhost:3000/api/user/verify/${token}`;

    await sendMail(
      email as string,
      "Email Verification",
      `Please verify your account by clicking on this link: ${verifyLink}`
    );

    res
      .status(200)
      .json({ message: "Verification email resent successfully." });
    return;
  } catch (error) {
    console.error("Error resending verification email:", error);
    res.status(500).json({ error: "Internal Server Error" });
    return;
  }
};

router.get("/verify/:token", verifyAccountHandler);
router.post("/resend-verification", resendVerificationHandler);
router.post("/register", registerHandler);
router.post("/login", loginHandler);

const deleteUserHandler: RequestHandler = async (
  req: Request,
  res: Response<{ message: string } | { error: string }>
): Promise<void> => {
  try {
    const { email } = req.body;

    if (!email) {
      res.status(400).json({ error: "Email is required" });
      return;
    }

    const user = await User.findOneAndDelete({ email });

    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

router.delete("/delete", deleteUserHandler);

export default router;

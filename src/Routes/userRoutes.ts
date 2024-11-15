import { Request, Response, Router, RequestHandler } from "express";
import { loginUser, registerUser } from "../Controllers/userController";
import auth, { CustomRequest } from "../Middleware/auth";
import { IUser } from "../Models/user";

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



const loginHandler: RequestHandler = async (req: Request, res: Response): Promise<void> => {
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



router.post("/register", registerHandler);
router.post("/login", loginHandler);




export default router;


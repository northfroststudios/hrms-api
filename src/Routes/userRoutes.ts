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
      email: req.body.email,
      password: req.body.password,
    };

    const loggedInUser = await loginUser(userData);

    if (loggedInUser?.error) {
      res.status(400).json({ error: loggedInUser.error });
      return;
    }

    res.status(200).json(loggedInUser);
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};



const logoutHandler: RequestHandler = async (req: CustomRequest, res: Response): Promise<void> => {
  try {
    if (req.user && req.token) {
      // Filter out the token to "log out" the user
      req.user.tokens = req.user.tokens.filter((tokenObj) => tokenObj.token !== req.token);
      
      
      await req.user.save();
      
      res.status(200).json({ message: "User logged out successfully." });
    } else {
      res.status(400).json({ error: "User not authenticated." });
    }
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

router.post("/register", registerHandler);
router.post("/login", loginHandler);
router.post("/logout", auth, logoutHandler);



export default router;

// import express, { Request, Response } from 'express';
// import { registerUser, loginUser } from '../controllers/userController';
// import auth, { CustomRequest } from '../middleware/auth';
// import User from '../models/User';

// const router = express.Router();

// // User Registration
// router.post('/users/register', async (req: Request, res: Response) => {
//     try {
//         const result = await registerUser(req.body);

//         if (result.error) {
//             return res.status(400).send({ error: result.error });
//         }

//         res.status(201).send(result);
//     } catch (error) {
//         res.status(400).send({ error: 'Error registering user' });
//     }
// });

// // User Login
// router.post('/users/login', async (req: Request, res: Response) => {
//     try {
//         const result = await loginUser(req.body);

//         if (!result) {
//             return res.status(401).send({ error: 'Invalid login credentials' });
//         }

//         if (result.error) {
//             return res.status(400).send({ error: result.error });
//         }

//         res.send(result);
//     } catch (error) {
//         res.status(400).send({ error: 'Error logging in' });
//     }
// });

// // User Logout (current session)
// router.post('/users/logout', auth, async (req: CustomRequest, res: Response) => {
//     try {
//         if (!req.user || !req.token) {
//             return res.status(401).send({ error: 'Authentication failed' });
//         }

//         req.user.tokens = req.user.tokens.filter((token) => token.token !== req.token);
//         await req.user.save();

//         res.send({ message: 'Logged out successfully' });
//     } catch (error) {
//         res.status(500).send({ error: 'Error logging out' });
//     }
// });

// // User Logout (all sessions)
// router.post('/users/logoutAll', auth, async (req: CustomRequest, res: Response) => {
//     try {
//         if (!req.user) {
//             return res.status(401).send({ error: 'Authentication failed' });
//         }

//         req.user.tokens = [];
//         await req.user.save();

//         res.send({ message: 'Logged out from all sessions successfully' });
//     } catch (error) {
//         res.status(500).send({ error: 'Error logging out from all sessions' });
//     }
// });

// // Get User Profile
// router.get('/users/me', auth, async (req: CustomRequest, res: Response) => {
//     try {
//         if (!req.user) {
//             return res.status(401).send({ error: 'Authentication failed' });
//         }
//         res.send(req.user);
//     } catch (error) {
//         res.status(500).send({ error: 'Error fetching profile' });
//     }
// });

// // Update User Profile
// router.patch('/users/me', auth, async (req: CustomRequest, res: Response) => {
//     const updates = Object.keys(req.body);
//     const allowedUpdates = ['firstname', 'lastname', 'email', 'password'];
//     const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

//     if (!isValidOperation) {
//         return res.status(400).send({ error: 'Invalid updates!' });
//     }

//     try {
//         if (!req.user) {
//             return res.status(401).send({ error: 'Authentication failed' });
//         }

//         updates.forEach((update) => {
//             if (update in req.body) {
//                 (req.user as any)[update] = req.body[update];
//             }
//         });

//         await req.user.save();
//         res.send(req.user);
//     } catch (error) {
//         res.status(400).send({ error: 'Error updating profile' });
//     }
// });

// // Delete User Account
// router.delete('/users/me', auth, async (req: CustomRequest, res: Response) => {
//     try {
//         if (!req.user) {
//             return res.status(401).send({ error: 'Authentication failed' });
//         }

//         await req.user.deleteOne();
//         res.send({ message: 'Account deleted successfully' });
//     } catch (error) {
//         res.status(500).send({ error: 'Error deleting account' });
//     }
// });

// export default router;

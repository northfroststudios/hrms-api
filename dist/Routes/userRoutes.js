"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const userController_1 = require("../Controllers/userController");
const auth_1 = __importDefault(require("../Middleware/auth"));
const router = (0, express_1.Router)();
router.post("/register", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userData = {
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            email: req.body.email,
            password: req.body.password,
        };
        const registeredUser = yield (0, userController_1.registerUser)(userData);
        if (registeredUser.error) {
            return res.status(400).json({ error: registeredUser.error });
        }
        return res.status(201).json(registeredUser);
    }
    catch (error) {
        console.error("Registration error:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}));
router.post("/login", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userData = {
        email: req.body.email,
        password: req.body.password,
    };
    const loggedInUser = yield (0, userController_1.loginUser)(userData);
    if (loggedInUser === null || loggedInUser === void 0 ? void 0 : loggedInUser.error) {
        return res.status(400).json({
            error: loggedInUser.error,
        });
    }
    return res.status(200).json(loggedInUser);
}));
// Fetch logged in user
router.get("/me", auth_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    return res.status(200).json({
        user: req.user,
    });
}));
// Logout user
router.post("/logout", auth_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.user) {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token;
        });
        yield req.user.save();
    }
    return res.status(200).json({
        message: "User logged out successfully.",
    });
}));
// Logout user from all devices
router.post("/logoutall", auth_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.user) {
        req.user.tokens = [];
        yield req.user.save();
    }
    return res.status(200).json({
        message: "User logged out from all devices successfully.",
    });
}));
exports.default = router;
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

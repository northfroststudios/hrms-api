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
exports.loginUser = exports.registerUser = void 0;
const user_1 = __importDefault(require("../Models/user"));
const registerUser = (user) => __awaiter(void 0, void 0, void 0, function* () {
    const { firstname, lastname, email, password } = user;
    if (!firstname || lastname || !email || !password) {
        return {
            error: 'Please provide all the required fields',
        };
    }
    const existingUser = yield user_1.default.findOne({ email });
    if (existingUser) {
        return {
            error: 'User with that email already exists.',
        };
    }
    const newUser = new user_1.default({ firstname, lastname, email, password });
    yield newUser.save();
    const token = yield newUser.generateAuthToken();
    return {
        user: newUser,
        token,
    };
});
exports.registerUser = registerUser;
const loginUser = (user) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = user;
    if (!email || !password) {
        return {
            error: 'Please provide all the required fields',
        };
    }
    const existingUser = yield user_1.default.findByCredentials(email, password);
    if (!existingUser) {
        return null;
    }
    const token = yield existingUser.generateAuthToken();
    return {
        user: existingUser,
        token,
    };
});
exports.loginUser = loginUser;

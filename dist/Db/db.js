"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
if (!process.env.MONGODB_URI) {
    throw new Error('MONGODB_URI is not defined');
}
console.log('Connecting to MongoDb...');
mongoose_1.default.connect(process.env.MONGODB_URI);

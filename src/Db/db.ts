import mongoose from "mongoose";

if(!process.env.MONGODB_URL){
    throw new Error('MONGODB_URL is not defined')
}
console.log('Connecting to MongoDb...')

mongoose.connect(process.env.MONGODB_URL)